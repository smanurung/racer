function Update () {
transform.localRotation = Quaternion.identity;
transform.Rotate(Input.GetAxis("Horizontal"),Input.GetAxis("Horizontal")*17,-Input.GetAxis("Horizontal")*40);
transform.Rotate(280.9997,0,0);
}