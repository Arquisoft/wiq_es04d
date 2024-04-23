Feature: Game Initialization

  Scenario: User Initiates a Game
    Given An unregistered user exists
    When the user enters their details on the register form and submits
    And the user is redirected to the homepage and logged in automatically
    And the user clicks the "Play" button on the homepage
    Then the questions should be displayed
