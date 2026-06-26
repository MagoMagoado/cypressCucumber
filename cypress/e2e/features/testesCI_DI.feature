# language: pt
Funcionalidade: Testes para CI/DI

  Contexto: Login Usuário Padrão
    Dado que acesso o sistema "saucedemo"
    E que efetuo o login utilizando o usuário "User Sauce"
    E que estou no documento "SAUCE"
    Então "VISUALIZO" "TÍTULO" com a mensagem "Swag Labs"

  Cenário: Validações de Sort
    Dado que estou no documento "SAUCE"
    Quando preencho o combobox "Filtro: Sort" com "Price (high to low)"
    E valido que combobox "Filtro: Sort" possui opções
      | OPCAO               |
      | Name (A to Z)       |
      | Name (Z to A)       |
      | Price (low to high) |
      | Price (high to low) |
    Então valido os campos por label
      | NOME         | TIPO  | VALOR                    |
      | Produto Nome | CAMPO | Sauce Labs Fleece Jacket |
      | Produto Nome | CAMPO | Sauce Labs Bike Light    |
      | Produto Nome | CAMPO | Sauce Labs Bolt T-Shirt  |
      | Produto Nome | CAMPO | Sauce Labs Fleece Jacket |
      | Produto Nome | CAMPO | Sauce Labs Onesie        |
    E clico no botão "Produto Sauce Labs Fleece Jacket"
    E o campo "Produto Preço" deve conter o valor "$49.99"

  Cenário: Validações de Carrinho
    Dado que estou no documento "SAUCE"
    Quando clico no botão "Add Sauce Labs Backpack"
    E clico no botão "Add Sauce Labs Bike Light"
    Então "VISUALIZO" "Quantidade Produtos" com a mensagem "2"
    Quando clico no botão "Remove Sauce Labs Backpack"
    Então "VISUALIZO" "Quantidade Produtos" com a mensagem "1"
    Quando clico no botão "Menu"
    E clico no botão "Reset App"
    Então valido se "Quantidade Produtos" está "NAO VISIVEL" na tela

  Cenário: Validações de Compra item
    Dado que estou no documento "SAUCE"
    Quando clico no botão "Add Sauce Labs Backpack"
    E clico no botão "Carrinho"
    Então o campo "Quantidade Carrinho" deve conter o valor "1"
    E clico no botão "Checkout"
    Quando preencho o campo "First Name" com "Jane"
    E preencho o campo "Last Name" com "Doe"
    E preencho o campo "Postal Code" com "00000001"
    E clico no botão "Continue"
    Então valido os campos por label
      | NOME        | TIPO  | VALOR                       |
      | Info Compra | CAMPO | SauceCard #31337            |
      | Info Compra | CAMPO | Free Pony Express Delivery! |
      | Info Compra | CAMPO | Item total: $29.99          |
      | Info Compra | CAMPO | Tax: $2.40                  |
      | Info Compra | CAMPO | Total: $32.39               |
    Quando clico no botão "Finish"
    Então "VISUALIZO" "SUBTÍTULO" com a mensagem "Thank you for your order!"