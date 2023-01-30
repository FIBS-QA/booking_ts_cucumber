Feature: Booking service /parkingSlot endpoint

  Scenario: POST, Create a parking slot entry
    Given POST request has been sent to parkingSlot
    When GET request has been sent to parkingSlots
    Then GET response contains the "POSTED" parking slot id, name

  Scenario: PUT, Update a parking slot entry
    Given POST request has been sent to parkingSlot
    Given PUT request has been sent to previously created parkingSlot
    When GET request has been sent to parkingSlots
    Then GET response contains the "PUT" parking slot id, name

  Scenario: DELETE a parking slot entry
    Given POST request has been sent to parkingSlot
    Given DELETE the previously created parkingSlot
    When GET request has been sent to parkingSlots
    Then GET response does NOT contains the previously created parkingSlot

  Scenario: GET parking slots: all of them contains id and name
    When GET request has been sent to parkingSlots
    Then Each parkingSlot contains id and name