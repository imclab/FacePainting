public var minInput : float = 0; //min value for OSCulator
public var maxInput : float = 10; //max value from OSCulator
public var minXOutput : float = -10; //min value for OSCulator
public var maxXOutput : float = 10; //max value from OSCulator
public var minYOutput : float = 10; //min value for OSCulator
public var maxYOutput : float = 22; //max value from OSCulator
public var minZOutput : float = -170; //min value for OSCulator
public var maxZOutput : float = -35; //max value from OSCulator
public var minThetaOutput : float = -0.3; //min value for OSCulator
public var maxThetaOutput : float = 0.9; //max value from OSCulator
public var minRhoOutput : float = -0.4; //min value for OSCulator
public var maxRhoOutput : float = 0.4; //max value from OSCulator
public var someObject : Transform;
public var nameFile: String;

public var hThresh : float = 5.5;
public var lThresh : float = 3.5;
private var leftEye : float;
private var rightEye : float;
private var leftEyeBrow : float;
private var rightEyeBrow : float;
public var snapshot : boolean = true;
public var rightEyeRec : boolean;
public var leftEyeRec : boolean;
public var rightEyeBrowRec : boolean;
public var leftEyeBrowRec : boolean;
private var fileCounter : int = 0;

function Start ()
{
	    rightEyeRec= false;
        leftEyeRec = false;
		rightEyeBrowRec = false;
		leftEyeBrowRec = false;
}

function Update ()
{
}

function OSCMessageReceived(message : OSC.NET.OSCMessage)
{
        if(message.Address == "/pose/position")
        {        
               	if(message.Values.Count == 2)
                {
                        var targetPosition : Vector2 = Vector2(Map(message.Values[0], minInput, maxInput, minXOutput, maxXOutput,true),
                        									   Map(message.Values[1], minInput, maxInput, minYOutput, maxYOutput,true));
                        transform.position.x = targetPosition.x;
                        transform.position.y = targetPosition.y;
                }
                else
                {
                        Debug.LogError("/pose/position has the wrong number of args");
                }
        }
 		else if(message.Address == "/pose/scale")
        {
                if(message.Values.Count == 1)
                {
                        var targetZPosition : float = Map(message.Values[0], minInput, maxInput, minZOutput, maxZOutput,true);
                        transform.position.z = targetZPosition;
                }
                else
                {
                        Debug.LogError("/pose/scale has the wrong number of args");
                }
        }
		else if(message.Address == "/pose/orientation")
        {
                if(message.Values.Count == 3)
                {
                        //Debug.Log("values are " + message.Values[0] + " " + message.Values[1]);
                        var targetOrientation : Vector2 = Vector2(Map(message.Values[0],minInput,maxInput, minThetaOutput, maxThetaOutput,true),
                        											Map(message.Values[1],minInput,maxInput, minRhoOutput, maxRhoOutput,true));
                        transform.rotation.x = targetOrientation.x;
                        transform.rotation.y = targetOrientation.y;
                }
                else
                {
                        Debug.LogError("/pose/orientation has the wrong number of args");
                }
        }
        else if(message.Address == "/eye/left")
        {
				if(message.Values.Count == 1)
                {
		        	leftEye = message.Values[0];   
        			leftEyeRec = true;     			 	
                }
                else
                {
                        Debug.LogError("/eye/left has the wrong number of args");
                }
        }
        else if(message.Address == "/eye/right")
        {
                if(message.Values.Count == 1)
                {
		        	rightEye = message.Values[0]; 
		        	rightEyeRec = true;            			 	
                }
                else
                {
                        Debug.LogError("/eye/right has the wrong number of args");
                }
        }
        else if(message.Address == "/eyebrow/left")
        {
				if(message.Values.Count == 1)
                {
		        	leftEyeBrow = message.Values[0];  
		        	leftEyeBrowRec = true;          			 	
                }
                else
                {
                        Debug.LogError("/eyebrow/left has the wrong number of args");
                }
        }
        else if(message.Address == "/eyebrow/right")
        {
                if(message.Values.Count == 1)
                {
		        	rightEyeBrow = message.Values[0]; 
		        	rightEyeBrowRec = true;            			 	
                }
                else
                {
                        Debug.LogError("/eyebrow/right has the wrong number of args");
                }
        }
	if(rightEyeRec && leftEyeRec && rightEyeBrowRec && leftEyeBrowRec)
	{
		if(snapshot == true)
		{
			Debug.Log(Mathf.Abs(rightEye-rightEyeBrow));
			Debug.Log(Mathf.Abs(leftEye-leftEyeBrow));
			if(Mathf.Abs(rightEye-rightEyeBrow)<lThresh)
			{
				Debug.Log("right eye closed");
				nameFile = "capture";
				nameFile += fileCounter;
				nameFile += ".png";
				fileCounter++;
				Application.CaptureScreenshot(nameFile);
				snapshot = false;
			}
			else if(Mathf.Abs(leftEye-leftEyeBrow)<lThresh)
			{
				Debug.Log("left eye closed");
				nameFile = "capture";
				nameFile += fileCounter;
				nameFile += ".png";
				fileCounter++;
				Application.CaptureScreenshot(nameFile);
				snapshot = false;
			}
		}
		else
		{
			if(Mathf.Abs(rightEye-rightEyeBrow)>hThresh)
			{
				Debug.Log("right eye open");
				snapshot = true;
			}
			else if(Mathf.Abs(leftEye-leftEyeBrow)>hThresh)
			{
				Debug.Log("left eye open");
				snapshot = true;
			}
		}
	}
}

function Map(value : float, inputMin : float, inputMax : float, outputMin : float, outputMax : float , clamp : boolean) : float
{
        if (Mathf.Abs(inputMin - inputMax) < Mathf.Epsilon)
        {
                return outputMin;
        }
        else
        {
                var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
                if( clamp )
                {
                        if(outputMax < outputMin)
                        {
                                if( outVal < outputMax )outVal = outputMax;
                                else if( outVal > outputMin )outVal = outputMin;
                        }
                        else
                        {
                                if( outVal > outputMax )outVal = outputMax;
                                else if( outVal < outputMin )outVal = outputMin;
                        }
                }
                return outVal;
        }
}
