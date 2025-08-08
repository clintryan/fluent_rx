# ActionMailer configuration for contact form emails

Rails.application.configure do
  # Base configuration
  config.action_mailer.default_options = {
    from: ENV.fetch('MAILER_FROM_EMAIL', 'info@fluentrx.com')
  }

  if Rails.env.production?
    # Production: Use custom domain SMTP
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      address: ENV.fetch('SMTP_ADDRESS', 'smtp.gmail.com'),
      port: ENV.fetch('SMTP_PORT', 587).to_i,
      domain: ENV.fetch('SMTP_DOMAIN', 'fluentrx.com'),
      user_name: ENV['SMTP_USERNAME'],
      password: ENV['SMTP_PASSWORD'],
      authentication: 'plain',
      enable_starttls_auto: true
    }
    config.action_mailer.perform_deliveries = true
    config.action_mailer.raise_delivery_errors = true
  else
    # Development: Use custom domain SMTP for testing
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      address: ENV.fetch('SMTP_ADDRESS', 'smtp.gmail.com'),
      port: ENV.fetch('SMTP_PORT', 587).to_i,
      domain: ENV.fetch('SMTP_DOMAIN', 'fluentrx.com'),
      user_name: ENV['SMTP_USERNAME'],
      password: ENV['SMTP_PASSWORD'],
      authentication: 'plain',
      enable_starttls_auto: true
    }
    config.action_mailer.perform_deliveries = true
    config.action_mailer.raise_delivery_errors = true
  end

  # Enable caching in all environments except development
  config.action_mailer.perform_caching = false unless Rails.env.development?
end
