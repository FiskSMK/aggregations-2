 <?php
$connection = new Mongo();
$db = $connection->selectDB( "test" );
$collection = $db->selectCollection( "train" );



$cursor = $collection->find();

while(($result = $cursor-> getNext()) == true){

	echo("<br/>");

	$zmienna = $result["Tags"];
	$zmienna1 = (count($zmienna));
	
	if($zmienna1 == 1){
	
		$result["Tags"] = explode(" ", $result["Tags"]);
		$collection->save($result);
	}
 
	$zmienna = $result["Tags"];
	$suma = $suma + $zmienna;
	print("Ilość tagów wynosi: ");
	echo count($suma);
	$zmienna = 0;
}


 ?>
