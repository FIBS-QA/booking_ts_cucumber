Feature: Booking service /booking endpoint

  Scenario: Book a 1 hour parking slot for current day
    Given POST request has been sent: "current day", 1 hour length
    When GET request has been sent with the previously used userId
    Then GET response contains expected types
    Then GET response contains 1 booking
    Then GET response's booking contains id between 0-5000
    Then GET response's booking startDate and endDate are the previously added ones

  Scenario: Book a 1 hour parking slot for already booked date
    Given POST request has been sent: "current day", 1 hour length
    Given POST request has been sent with previous date
    When GET request has been sent with the previously used userId
    Then GET response contains expected types
    Then GET response contains 2 booking
    Then GET response booking's should have different ids
    Then GET response's booking contains id between 0-5000
    Then GET response's booking startDate and endDate are the previously added ones

  Scenario: Book a 1 hour parking slot for yesterday
    Given POST request has been sent: "yesterday", 1 hour length
    When GET request has been sent with the previously used userId
    Then GET response contains 0 booking

  Scenario: Book a 1 hour parking slot for next year
    Given POST request has been sent: "next year", 1 hour length
    When GET request has been sent with the previously used userId
    Then GET response contains expected types
    Then GET response contains 1 booking
    Then GET response's booking contains id between 0-5000
    Then GET response's booking startDate and endDate are the previously added ones

  Scenario: Book a 1 hour parking slot for current date + 5000
    Given POST request has been sent: "current date + 5000", 1 hour length
    When GET request has been sent with the previously used userId
    Then GET response contains expected types
    Then GET response contains 1 booking
    Then GET response's booking contains id between 0-5000
    Then GET response's booking startDate and endDate are the previously added ones

  Scenario: Book a -1 hour parking slot for current day
    Given POST request has been sent: "current day", -1 hour length
    Then POST request should return 3 error code and "Requested booking interval is invalid"

  Scenario: Book a 10 hour parking slot for current day
    Given POST request has been sent: "current day", 10 hour length
    When GET request has been sent with the previously used userId
    Then GET response contains expected types
    Then GET response contains 1 booking
    Then GET response's booking contains id between 0-5000
    Then GET response's booking startDate and endDate are the previously added ones

  Scenario: Book a 100 hour parking slot for current day
    Given POST request has been sent: "current day", 100 hour length
    Then POST request should return 3 error code and "Requested booking interval is invalid"

  Scenario: Book a 10000 hour parking slot for current day
    Given POST request has been sent: "current day", 10000 hour length
    Then POST request should return 3 error code and "Requested booking interval is invalid"

  Scenario: Book with incorrect date inputs
    Given Incorrect POST request has been sent: "empty date" input
    Then POST request should return 3 error code and "Invalid Timestamp value: "

  Scenario: Book with incorrect userId input
    Given Incorrect POST request has been sent: "empty userId" input
    Then POST request should return 3 error code and "Expected string value for Timestamp."

  Scenario: Delete booking
    Given POST request has been sent: "current day", 1 hour length
    When DELETE request has been sent: previously used booking id
    Then GET request has been sent with the previously used bookingId
    Then GET response contains 0 booking

  Scenario: Delete booking with string input
    Given POST request has been sent: "current day", 1 hour length
    When DELETE request has been sent with incorrectString
    Then GET request has been sent with the previously used bookingId
    Then GET response contains 1 booking

  Scenario: Delete booking with unused bookingId
    Given POST request has been sent: "current day", 1 hour length
    When DELETE request has been sent with 100000
    Then GET request has been sent with the previously used bookingId
    Then GET response contains 1 booking
