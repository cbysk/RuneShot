class Laser extends Weapon {
    private var collisions: int = 0;
    private var explodeAt: int = 0;
    private var exploded: boolean = false;

    private var explosionEffect: String = "Particles/Sparks";
   
    private var gunModel: String = "Bazooka/prefabs/bazooka";
    private var gunOffset: Vector3 = Vector3(.23,-.12,.4);
    private var gunRotation: Quaternion = Quaternion.Euler(0.0, 90.0, 0.0);
     
	function GetModelLoc() {
		return gunModel;
	}
	
	function GetGunOffset() {
		return gunOffset;
	}
	
	function GetGunRotation() {
		return gunRotation;
	}

    function Start() {
    }

    function Update() {
        if (exploded)
        {
            Explode();
        }
    }
    
   /* function CreateModel()
    {
	    var cam = Camera.main;
	    gunPrefab = Resources.Load(gunModel, GameObject);
	   	var gun = GameObject.Instantiate(gunPrefab, cam.transform.position, Quaternion(0.0, 0.0, 0.0, 0.0));
	   	gun.name = "WeaponModel";
	    gun.transform.parent = cam.transform;
	    gun.transform.localPosition = gunOffset;
	    gun.transform.localRotation = gunRotation;
    }*/

    function OnCollisionEnter(collision: Collision) {
        var other: GameObject = collision.gameObject;
        if ((other.tag == "Player" || other.tag == "NPC") && (collisions > 0 ||
                                      (collisions <= 0 && !IsLauncher(other)))) {
            transform.parent = other.transform;
            collider.enabled = false;
            exploded = true;
        }
        else {
            collider.enabled = false;
            
            exploded = true;
        }

        collisions += 1;
    }

    function IsLauncher(obj: GameObject): boolean {
        return obj.GetInstanceID() == this.launchingPlayer.GetInstanceID();
    }

    function GetDamage(): int {
        return 25;
    }

     function GetDamageRadius(): int {
        return 1.25;
     }

     function Explode() { 
        NetworkUtil.Instantiate(Resources.Load(explosionEffect),transform.position,Quaternion.identity,NetworkGroup.Explosion);
         
        var damageRadius: int = GetDamageRadius();

        var colliders: Collider[] = Physics.OverlapSphere(transform.position, damageRadius);

         var damage: int = GetDamage();
         for(var hit in colliders) {
            if((hit.gameObject.tag == "NPC" || hit.gameObject.tag == "Player") && !IsLauncher(hit.gameObject)) {
                ComponentUtil.GetComponentInHierarchy(hit.gameObject,"Health").ResolveDamage(damage, gameObject);
                break;
            }
         }
         

        Destroy(gameObject);
     }

    function Trigger(launchingPlayer: GameObject, facing: Vector3, pressDuration: int) {
        triggered = true;
        this.launchingPlayer = launchingPlayer;
        gameObject.transform.forward = facing;

        rigidbody.useGravity=false;
        rigidbody.AddRelativeForce(Vector3(0,0,2500));
        
        // The grenade should not collide with the player that spawns it until it is safely outside that player.
        // The easiest way to accomplish this is to tell Physics to ignore collision between the player and the grenade.
        Physics.IgnoreCollision(launchingPlayer.collider,gameObject.collider);
    }
}
