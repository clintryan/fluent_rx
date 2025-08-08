class PagesController < ApplicationController
  def home
  end

  def talk_business
  end

  def about
  end

  def book
  end

  def our_approach
  end

  def client_results
  end

  def contact
  end

  def submit_contact
    # Validate required fields
    if contact_params[:full_name].blank? || contact_params[:email].blank? || 
       contact_params[:subject].blank? || contact_params[:message].blank?
      flash[:error] = "Please fill in all required fields."
      redirect_to contact_path
      return
    end

    # Validate email format
    unless contact_params[:email].match?(/\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i)
      flash[:error] = "Please enter a valid email address."
      redirect_to contact_path
      return
    end

    begin
      # Send notification email to FluentRx
      ContactMailer.contact_email(contact_params).deliver_now
      
      # Send auto-reply to customer
      ContactMailer.auto_reply(contact_params).deliver_now
      
      flash[:success] = "Thank you for your message, #{contact_params[:full_name]}! We'll be in touch within 1-2 business days."
      redirect_to contact_path, status: :see_other
    rescue StandardError => e
      Rails.logger.error "Contact form error: #{e.message}"
      flash[:error] = "Sorry, there was an error sending your message. Please try again or contact us directly."
      redirect_to contact_path, status: :see_other
    end
  end

  private

  def contact_params
    params.permit(:full_name, :email, :phone, :subject, :message)
  end
end
