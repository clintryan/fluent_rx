class ContactMailer < ApplicationMailer
  def contact_email(contact_params)
    @name = contact_params[:full_name]
    @email = contact_params[:email]
    @phone = contact_params[:phone]
    @subject = contact_params[:subject]
    @message = contact_params[:message]
    @submitted_at = Time.current
    
    mail(
      to: ENV.fetch('CONTACT_EMAIL', 'info@fluentrx.com'),
      subject: "New Contact Form Submission: #{@subject}",
      reply_to: @email
    )
  end

  def auto_reply(contact_params)
    @name = contact_params[:full_name]
    
    mail(
      to: contact_params[:email],
      subject: "Thank you for contacting FluentRx",
      from: ENV.fetch('MAILER_FROM_EMAIL', 'info@fluentrx.com')
    )
  end
end
