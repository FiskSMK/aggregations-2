#!/bin/bash
DIRECTORY='/tmp/accidents_import/'
FILENAME_MASK='Accidents.*csv$'
mkdir $DIRECTORY -p
cp Accidents-NoHeader?.csv $DIRECTORY
chmod a+rwx $DIRECTORY

curl -XPUT localhost:9200/_river/accidents/_meta -d "
{
    type : \"csv\",
    csv_file : {
        folder : \"$DIRECTORY\",
        filename_mask : \"$FILENAME_MASK\",
        poll:\"10s\",
        fields : [
            \"AccidentIndex\",
            \"PoliceForce\",
            \"AccidentSeverity\",
            \"NumberOfVehicles\",
            \"NumberOfCasualties\",
            \"Date\",
            \"DayOfWeek\",
            \"RoadType\",
            \"SpeedLimit\",
            \"TimeOfDay\",
            \"LightsPresent\",
            \"Weather\",
            \"Wind\",
            \"RoadConditions\",
            \"SpecialConditions\",
            \"CarriagewayHazards\",
            \"UrbanOrRuralArea\",
            \"PoliceOfficerAttended\",
            \"LSOAOfLocation\"
        ],
        field_separator : \",\",
        escape_character : \";\"
    },
    index : {
        index : \"accidents\",
        type : \"accidents\",
        bulk_size : 100000,
        bulk_threshold : 50
    }
}"
