Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "pages#home"
  
      # Course pages
    get 'talk-business', to: 'pages#talk_business'
    get 'about', to: 'pages#about'
end
