// ----------- CAR TUTORIAL SAMPLE PROJECT, ? Andrew Gotow 2009 -----------------

// Here's the basic car script described in my tutorial at www.gotow.net/andrew/blog.
// A Complete explaination of how this script works can be found at the link above, along
// with detailed instructions on how to write one of your own, and tips on what values to 
// assign to the script variables for it to work well for your application.

// Contact me at Maxwelldoggums@Gmail.com for more information.

// Extensively modified by Majatek, 2011 - McLaren models from freeware 3d model sites
// Contact me at majatekzivennoze@gmail.com for inquiries.

// These variables allow the script to power the wheels of the car.

var camera1 : Camera;
var camera2 : Camera; 
var camera3 : Camera;
var camera4 : Camera; 

var FrontLeftWheel : WheelCollider;
var FrontRightWheel : WheelCollider;
var BackLeftWheel : WheelCollider;
var BackRightWheel : WheelCollider;
var Tacho_meter : Collider ;

// These variables are for the gears, the array is the list of ratios. The script
// uses the defined gear ratios to determine how much torque to apply to the wheels.
var GearRatio : float[];
var CurrentGear : int = 0;

// These variables are just for applying torque to the wheels and shifting gears.
// using the defined Max and Min Engine RPM, the script can determine what gear the
// car needs to be in.
var EngineTorque : float = 600.0;
var MaxEngineRPM : float = 3000.0;
var MinEngineRPM : float = 1000.0;
private var EngineRPM : float = 0.0;

// Physics variables that make the simulation more balanced
var mass_center : float = .025;
var slip1 : float;
var slip2 : float;

function Start () {
	// I usually alter the center of mass to make the car more stable. I'ts less likely to flip this way.
	rigidbody.centerOfMass.y = -1;
	camera1.enabled = true;
    camera2.enabled = false; 
	camera3.enabled = false; 
	camera4.enabled = false; 
}

function Update () {

	if (Input.GetKeyDown ("4")){
      camera1.enabled = false;
	  camera2.enabled = false;
	  camera3.enabled = false;
      camera4.enabled = true;
	  }
	if (Input.GetKeyDown ("3")){
      camera1.enabled = false;
	  camera2.enabled = false;
	  camera4.enabled = false;
      camera3.enabled = true;
	  }
	if (Input.GetKeyDown ("2")){
      camera1.enabled = false;
	  camera3.enabled = false;
	  camera4.enabled = false;
      camera2.enabled = true;
	  }
   if (Input.GetKeyDown ("1")){
      camera1.enabled = true;
      camera2.enabled = false;
	  camera3.enabled = false;
	  camera4.enabled = false;
	  }
	
	////////////////////////////
	Tacho_meter.transform.localRotation = Quaternion.identity;
    Tacho_meter.transform.Rotate(320,245,0);
    Tacho_meter.transform.Rotate(-Mathf.Clamp(EngineRPM/10,0,220),0,0);
	////////////////////////////

	// Clamping the minimum and maximum position of the center of mass provides stability at high speeds
	// This also allows stationary cars to be bowled over/roll on uneven terrain
	mass_center = Mathf.Clamp((.3+(rigidbody.velocity.magnitude / 35)),.02,1.2);
	rigidbody.centerOfMass.y = -mass_center;
	//rigidbody.centerOfMass.x = Input.GetAxis("Horizontal")*(rigidbody.velocity.magnitude/1000);
	
	// This is to limit the maximum speed of the car, adjusting the drag probably isn't the best way of doing it,
	// but it's easy, and it doesn't interfere with the physics processing.
	rigidbody.drag = (rigidbody.velocity.magnitude / 125);//+Mathf.Clamp(5-rigidbody.velocity.magnitude,0,5);
	//rigidbody.drag=1;
	
	// Compute the engine RPM based on the average RPM of the two wheels, then call the shift gear function
	EngineRPM = (BackLeftWheel.rpm + BackRightWheel.rpm)/2 * GearRatio[CurrentGear];
	ShiftGears();

	// set the audio pitch to the percentage of RPM to the maximum RPM plus one, this makes the sound play
	// up to twice it's pitch, where it will suddenly drop when it switches gears.
	audio.pitch = Mathf.Abs(EngineRPM / MaxEngineRPM) + .75 ;
	// this line is just to ensure that the pitch does not reach a value higher than is desired.
	if ( audio.pitch > 2.0 ) {
		audio.pitch = 2.0;
	}

	// finally, apply the values to the wheels.	The torque applied is divided by the current gear, and
	// multiplied by the user input variable.
	BackLeftWheel.motorTorque = EngineTorque / GearRatio[CurrentGear] * Input.GetAxis("Vertical");
	BackRightWheel.motorTorque = EngineTorque / GearRatio[CurrentGear] * Input.GetAxis("Vertical");
	
	// the steer angle is an arbitrary value multiplied by the user input.
	FrontLeftWheel.steerAngle = (35 * Input.GetAxis("Horizontal"))/Mathf.Clamp(rigidbody.velocity.magnitude/15,1,20);//*Mathf.Clamp((100-rigidbody.velocity.magnitude)/100,.03,1);
	FrontRightWheel.steerAngle = (35 * Input.GetAxis("Horizontal"))/Mathf.Clamp(rigidbody.velocity.magnitude/15,1,20);//*Mathf.Clamp((100-rigidbody.velocity.magnitude)/100,.03,1);
}

function ShiftGears() {
	// this funciton shifts the gears of the vehcile, it loops through all the gears, checking which will make
	// the engine RPM fall within the desired range. The gear is then set to this "appropriate" value.
	if ( EngineRPM >= MaxEngineRPM ) {
		var AppropriateGear : int = CurrentGear;
		
		for ( var i = 0; i < GearRatio.length; i ++ ) {
			if ( BackLeftWheel.rpm * GearRatio[i] < MaxEngineRPM ) {
				AppropriateGear = i;
				break;
			}
		}
		
		CurrentGear = AppropriateGear;
	}
	
	if ( EngineRPM <= MinEngineRPM ) {
		AppropriateGear = CurrentGear;
		
		for ( var j = GearRatio.length-1; j >= 0; j -- ) {
			if ( BackRightWheel.rpm * GearRatio[j] > MinEngineRPM ) {
				AppropriateGear = j;
				break;
			}
		}
		
		CurrentGear = AppropriateGear;
	}
}