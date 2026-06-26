# language: pt
Funcionalidade: Testes para CI/DI

  Contexto: Login Usuário Padrão
    Dado que acesso o sistema "saucedemo"
    E que efetuo o login utilizando o usuário "User Sauce"
    Então "VISUALIZO" "TÍTULO" com a mensagem "Swag Labs"

  Cenário: Validações de Sort
    Dado preencho o combobox "Filtro: Sort" com "Price (high to low)"
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
    E o campo "Produto Preço" deve conter o valor "$29.99"