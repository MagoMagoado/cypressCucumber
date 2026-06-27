# language: pt
@local
Funcionalidade: Validações de teste

  Contexto: Login Usuário Comum
    Dado que acesso o sistema "QA"
    Quando clico no botão "Sign in"
    E que efetuo o login utilizando o usuário "Jane Doe"
    Então valido se "VISUALIZO" "TÍTULO" com mensagem "My account"
    # E valido que endpoint "Dados Usuário" foi chamado

  Cenário: Validações Filtro Home Geral
    Dado acesso o menu "Home"
    # E valido que endpoint "Produtos Home" foi chamado
    E que estou no documento "HOME"
    Quando preencho o combobox "Filtro: Sort" com "Name (A - Z)"
    E valido o combobox "Filtro: Sort" com opções
      | OPCAO              |
      | Name (A - Z)       |
      | Name (Z - A)       |
      | Price (High - Low) |
      | Price (Low - High) |
      | CO₂ Rating (A - E) |
      | CO₂ Rating (E - A) |
    Então valido os campos por label
      | NOME         | TIPO  | VALOR              |
      | Produto Nome | CAMPO | Adjustable Wrench  |
      | Produto Nome | CAMPO | Angled Spanner     |
      | Produto Nome | CAMPO | Belt Sander        |
      | Produto Nome | CAMPO | Bolt Cutters       |
    E valido o campo "Filtro: By category" com valor "By category:"
    Quando preencho o campo "Filtro: Search" com "Hammer"
    E clico no botão "Search"
    Então valido se "VISUALIZO" "Quantidade Produtos" com mensagem "6 products found for 'Hammer'"
    Então valido os campos por label
      | NOME         | TIPO  | VALOR                                 |
      | Produto Nome | CAMPO | Claw Hammer with Shock Reduction Grip |
      | Produto Nome | CAMPO | Hammer                                |
      | Produto Nome | CAMPO | Claw Hammer                           |
      | Produto Nome | CAMPO | Thor Hammer                           |
      | Produto Nome | CAMPO | Claw Hammer with Fiberglass Handle    |
      | Produto Nome | CAMPO | Court Hammer                          |

  Cenário: Validações Filtro Home Específicos
    Dado acesso o menu "Home"
    # E valido que endpoint "Produtos Home" foi chamado
    E que estou no documento "HOME"
    Quando "MARCO" o checkbox "Filtro: Hand Saw"
    Então valido se checkbox "Filtro: Hand Saw" está "MARCADO"
    E valido que "Produto Wood Saw" co2 tem categoria "B"
    E clico no botão "Limpar Filtro"
    Quando que deslizo o slider "Filtro: Preço" para mínimo "2" e máximo "4"
    # Então valido os campos por label
    #   | NOME         | TIPO  | VALOR                 |
    #   | Produto Nome | CAMPO | Washers               |
    #   | Produto Nome | CAMPO | Flat-Head Wood Screws |

  Cenário: Validações Aba Contact
    Dado acesso o menu "Contact"
    Quando preencho os campos
      | NOME                | TIPO     | VALOR            |
      | Contact: First name | CAMPO    | Jane             |
      | Contact: Last name  | CAMPO    | Doe              |
      | Contact: Email      | CAMPO    | j@hotmail.com    |
      | Contact: Subject    | COMBOBOX | Customer service |
    E preencho o campo "Contact: Message" com "Lorem ipsum dolor sit amet consectetur adipiscing"
    E clico no botão "Contact: Send"
    Então valido se "VISUALIZO" "ALERT" com mensagem "Message must be minimal 50 characters"
    Quando preencho o campo "Contact: Message" com "Lorem ipsum dolor sit amet consectetur adipiscing."
    # E clico no botão "Contact: Send"
    # Então valido se "VISUALIZO" "ALERT" com mensagem "Thanks for your message! We will contact you shortly."
