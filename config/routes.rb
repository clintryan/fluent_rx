Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "pages#home"
  
  # Course pages
  get 'talk-business', to: 'pages#talk_business'
  get 'about', to: 'pages#about'
  get 'book', to: 'pages#book'
  
  # Additional pages
  get 'our-approach', to: 'pages#our_approach'
  get 'client-results', to: 'pages#client_results'
  get 'contact', to: 'pages#contact'
  post 'contact', to: 'pages#submit_contact'
  
  # Courses
  get 'courses', to: 'courses#index'
  get 'courses/business-briefing', to: 'courses#business_briefing'
  get 'courses/strategy-room', to: 'courses#strategy_room'
  get 'courses/interview-playbook', to: 'courses#interview_playbook'
  get 'courses/job-toolkit', to: 'courses#job_toolkit'
  get 'courses/educators-edge', to: 'courses#educators_edge'
  get 'courses/score-accelerator', to: 'courses#score_accelerator'
end
