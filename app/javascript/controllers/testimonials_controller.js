import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="testimonials"
export default class extends Controller {
  static targets = [
    "filters",
    "curated",
    "library",
    "showMoreButton"
  ]

  connect() {
    this.allTestimonials = []
    this.curatedIds = new Set()
    this.visibleCount = 9
    this.activeTag = null
    this.loadTestimonials()
  }

  async loadTestimonials() {
    try {
      const response = await fetch("/data/testimonials.json", { headers: { accept: "application/json" } })
      if (!response.ok) throw new Error("Failed to load testimonials")
      this.allTestimonials = await response.json()

      // Define curated set: tagged 'featured' or 'homepage' (next-best highlights)
      const curated = this.allTestimonials.filter(t => (t.tags || []).some(tag => ["featured", "homepage"].includes(tag))).slice(0, 9)
      this.curatedIds = new Set(curated.map(t => t.id))

      this.renderFilters(this.allTestimonials)
      this.renderCurated(curated)
      this.renderLibrary()
    } catch (e) {
      this.curatedTarget.innerHTML = this.errorBox("Unable to load testimonials. Please try again later.")
      this.libraryTarget.innerHTML = ""
    }
  }

  renderFilters(testimonials) {
    const tagCounts = new Map()
    testimonials.forEach(t => (t.tags || []).forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)))

    // Sort tags alphabetically, featured/homepage last in filter list
    const tags = Array.from(tagCounts.keys()).filter(t => !["featured", "homepage"].includes(t)).sort((a,b) => a.localeCompare(b))

    const buttonClassBase = "inline-block py-2 px-4 rounded-md font-semibold transition-all duration-300 ease-in-out border"
    const inactive = "bg-white text-secondary border-secondary hover:bg-secondary hover:text-white"
    const active = "bg-secondary text-white border-secondary hover:bg-secondary-dark"

    let html = ""
    html += `<button type="button" data-action="testimonials#filterAll" class="${buttonClassBase} ${this.activeTag ? inactive : active}">All</button>`
    html += tags.map(tag => {
      const isActive = this.activeTag === tag
      const label = this.humanize(tag)
      return `<button type="button" data-action="testimonials#filter" data-tag="${this.escape(tag)}" class="${buttonClassBase} ${isActive ? active : inactive}">${label}</button>`
    }).join("")

    this.filtersTarget.innerHTML = `<div class="flex flex-wrap gap-3 justify-center">${html}</div>`
  }

  filter(event) {
    this.activeTag = event.currentTarget.getAttribute("data-tag")
    this.visibleCount = 9
    this.renderFilters(this.allTestimonials)
    this.renderLibrary()
  }

  filterAll() {
    this.activeTag = null
    this.visibleCount = 9
    this.renderFilters(this.allTestimonials)
    this.renderLibrary()
  }

  showMore() {
    this.visibleCount += 12
    this.renderLibrary()
  }

  renderCurated(curated) {
    if (!curated.length) {
      this.curatedTarget.innerHTML = ""
      return
    }
    const cards = curated.map(t => this.testimonialCard(t)).join("")
    this.curatedTarget.innerHTML = `
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">${cards}</div>
    `
  }

  renderLibrary() {
    let items = this.allTestimonials.filter(t => !this.curatedIds.has(t.id))
    if (this.activeTag) {
      items = items.filter(t => (t.tags || []).includes(this.activeTag))
    }
    const total = items.length
    const visible = items.slice(0, this.visibleCount)

    const cards = visible.map(t => this.testimonialCard(t)).join("")

    const grid = `<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">${cards}</div>`
    const remaining = total - visible.length

    let controls = ""
    if (remaining > 0) {
      controls = `<div class="mt-10 text-center">
        <button type="button" data-action="testimonials#showMore" class="inline-block py-3 px-6 rounded-md font-semibold transition-all duration-300 ease-in-out bg-secondary text-white hover:bg-secondary-dark shadow-md hover:shadow-lg">Show More (${remaining})</button>
      </div>`
    }

    this.libraryTarget.innerHTML = `${grid}${controls}`
  }

  testimonialCard(t) {
    const quoteSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-5 w-5 text-secondary" fill="currentColor" aria-hidden="true">
        <path d="M464 256h-80V128h-80v128h80v128h80V256zM208 256H128V128H48v128h80v128h80V256z"/>
      </svg>
    `

    const pull = t.testimonialText
    const name = t.name || "Anonymous"
    const context = t.professionalContext || ""

    return `
      <div class="flex flex-col rounded-lg bg-white p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary hover:-translate-y-1">
        <div class="flex-grow">
          ${quoteSvg}
          <blockquote class="mt-4 text-text-dark"><p>${this.escape(pull)}</p></blockquote>
        </div>
        <footer class="mt-6">
          <p class="font-semibold text-primary">${this.escape(name)}</p>
          ${context ? `<p class="text-sm text-secondary italic">${this.escape(context)}</p>` : ""}
        </footer>
      </div>
    `
  }

  errorBox(message) {
    return `<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">${this.escape(message)}</div>`
  }

  humanize(tag) {
    return tag.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  escape(str) {
    return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))
  }
}


