class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('MAILER_FROM_EMAIL', 'info@fluentrx.com')
  layout "mailer"
end
