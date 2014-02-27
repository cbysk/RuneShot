class Weapon extends MonoBehaviour {
    public var launchingPlayer: GameObject = null;
    
    private var gunPrefab: GameObject; 
    private var gunModel: String = "";
    private var gunOffset: Vector3 = Vector3(0,0,0);
    private var gunRotation: Quaternion = Quaternion.Euler(0.0, 0.0, 0.0);
    
    function GetOwnerNetworkID(): NetworkViewID {
        var networkID: NetworkViewID;
        var networkChar = ComponentUtil.GetComponentInHierarchy(launchingPlayer,typeof(CharacterNetwork)) as CharacterNetwork;
        if (networkChar != null){
            networkID = networkChar.networkView.viewID;
        }
        
        return networkID;
    }
    
    function GetModelLoc() {
		return gunModel;
	}
	
	function GetGunOffset() {
		return gunOffset;
	}
	
	function GetGunRotation() {
		return gunRotation;
	}
    
    function CreateModel() {
    	var currentModel = Camera.main.transform.Find("WeaponModel");
    	if (currentModel != null) {
    		Destroy(currentModel.gameObject);
    	}
   		var cam = Camera.main;
	    gunPrefab = Resources.Load(GetModelLoc(), GameObject);
	   	var gun = GameObject.Instantiate(gunPrefab, cam.transform.position, Quaternion(0.0, 0.0, 0.0, 0.0));
	   	gun.name = "WeaponModel";
	    gun.transform.parent = cam.transform;
	    gun.transform.localPosition = GetGunOffset();
	    gun.transform.localRotation = GetGunRotation();
    }
}
