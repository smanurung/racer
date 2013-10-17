var BackLeftWheel : WheelCollider;
var BackRightWheel : WheelCollider;

var rpm = 0;

function Update () {
transform.localRotation = Quaternion.identity;
transform.Rotate(320,245,0);

rpm=(BackLeftWheel.rpm + BackRightWheel.rpm)/1.5;// * Playercar.GearRatio[Playercar.CurrentGear];
transform.Rotate(-rpm/10,0,0);
}