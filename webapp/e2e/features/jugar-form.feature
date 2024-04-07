Feature: Game Initialization

  Scenario: User Initiates a Game
    Given a registered user exists
    When the user enters their details on the login form and submits
    And the user clicks the "Play" button on the homepage
    Then the questions should be displayed