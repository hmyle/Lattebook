#include <Stepper.h>

#define STEPPER_PIN_1 8
#define STEPPER_PIN_2 9
#define STEPPER_PIN_3 10
#define STEPPER_PIN_4 11

Stepper myStepper(2048, STEPPER_PIN_1, STEPPER_PIN_2, STEPPER_PIN_3, STEPPER_PIN_4);

bool rotationPerformed = false;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  myStepper.setSpeed(10);
  myStepper.step(2048);
}

void loop() {
  String readString;
  String Q;

  while (Serial.available()) {
    delay(10);

    if (Serial.available() > 0) {
      char c = Serial.read();
      readString += c;
    }
  }

  Q = readString;

  if (Q.length() > 0 && Q.charAt(Q.length() - 1) == '1') {
    myStepper.step(1024);
    delay(5000);
    myStepper.step(-1024);
  }

  delay(3000);
}