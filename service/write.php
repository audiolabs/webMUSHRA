<?php
/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/



function sanitize($string = '', $is_filename = FALSE)
{
 // Replace all weird characters with dashes
 $string = preg_replace('/[^\w\-'. ($is_filename ? '~_\.' : ''). ']+/u', '-', $string);
 // Only allow one dash separator at a time (and make string lowercase)
 return strtolower(preg_replace('/--+/u', '-', $string));
}


$sessionParam = null;
if(get_magic_quotes_gpc()){
  $sessionParam = stripslashes($_POST['sessionJSON']);
}else{
  $sessionParam = $_POST['sessionJSON'];
}
$session = json_decode($sessionParam);


$filepathPrefix = "../results/".sanitize($string = $session->testId, $is_filename =FALSE)."/";
$filepathPostfix = ".csv";

if (!is_dir($filepathPrefix)) {
    mkdir($filepathPrefix);
}
$length = count($session->participant->name);
// mushra
$write_mushra = false;
$mushraCsvData = array();


$input = array("session_test_id");
for($i =0; $i < $length; $i++){
	array_push($input, $session->participant->name[$i]);
}
array_push($input, "trial_id", "rating_stimulus", "rating_score", "rating_time", "rating_comment");
array_push($mushraCsvData, $input);

 
 
 foreach ($session->trials as $trial) {
  if ($trial->type == "mushra") {
	$write_mushra = true;

	  foreach ($trial->responses as $response) {
	  	
		
		$results = array($session->testId);
		for($i =0; $i < $length; $i++){
			array_push($results, $session->participant->response[$i]);
		}  
		array_push($results, $trial->id, $response->stimulus, $response->score, $response->time, $response->comment); 
	  
	  	array_push($mushraCsvData, $results);
	  	
	  
	  } 
	    /*array_push($mushraCsvData, array($session->testId, $session->participant->email, $session->participant->age, $session->participant->gender, $trial->id, $response->stimulus, $response->score, $response->time, $response->comment));
		 * 
		 */     
  }
}
		
if ($write_mushra) {
	$filename = $filepathPrefix."mushra".$filepathPostfix;
	$isFile = is_file($filename);
	$fp = fopen($filename, 'a');
	foreach ($mushraCsvData as $row) {
		if ($isFile) {	    	
			$isFile = false;
		} else {
		   fputcsv($fp, $row);
		}
	}
	fclose($fp);
}

// paired comparison

$write_pc = false;
$pcCsvData = array();
// array_push($pcCsvData, array("session_test_id", "participant_email", "participant_age", "participant_gender", "trial_id", "choice_reference", "choice_non_reference", "choice_answer", "choice_time", "choice_comment"));

$input = array("session_test_id");
for($i =0; $i < $length; $i++){
	array_push($input, $session->participant->name[$i]);
}
array_push($input, "trial_id", "choice_reference", "choice_non_reference", "choice_answer", "choice_time", "choice_comment");
array_push($pcCsvData, $input);



foreach ($session->trials as $trial) {
  if ($trial->type == "paired_comparison") {
	  foreach ($trial->responses as $response) {	  	
	  	$write_pc = true;
		  
		 
		$results = array($session->testId);
		for($i =0; $i < $length; $i++){
			array_push($results, $session->participant->response[$i]);
		}  
		array_push($results, $trial->id, $response->reference, $response->nonReference, $response->answer, $response->time, $response->comment);
	  
	  	array_push($pcCsvData, $results); 
		  
		  
	    // array_push($pcCsvData, array($session->testId, $session->participant->email, $session->participant->age, $session->participant->gender, $trial->id, $response->reference, $response->nonReference, $response->answer, $response->time, $response->comment));    
	  }
  }
}

if ($write_pc) {
	$filename = $filepathPrefix."paired_comparison".$filepathPostfix;
	$isFile = is_file($filename);
	$fp = fopen($filename, 'a');
	foreach ($pcCsvData as $row) {
		if ($isFile) {	    	
			$isFile = false;
		} else {
		   fputcsv($fp, $row);
		}
	}
	fclose($fp);
}

// bs1116

$write_bs1116 = false;
$bs1116CsvData = array();

$input = array("session_test_id");
for($i =0; $i < $length; $i++){
	array_push($input, $session->participant->name[$i]);
}
array_push($input,  "trial_id", "rating_reference", "rating_non_reference", "rating_reference_score", "rating_non_reference_score", "rating_time", "choice_comment");
array_push($bs1116CsvData, $input);

// array_push($bs1116CsvData, array("session_test_id", "participant_email", "participant_age", "participant_gender", "trial_id", "rating_reference", "rating_non_reference", "rating_reference_score", "rating_non_reference_score", "rating_time", "choice_comment"));
foreach ($session->trials as $trial) {
  if ($trial->type == "bs1116") {
	  foreach ($trial->responses as $response) {	  	
	  	$write_bs1116 = true;
		  
		$results = array($session->testId);
		for($i =0; $i < $length; $i++){
			array_push($results, $session->participant->response[$i]);
		}  
		array_push($results, $trial->id, $response->reference, $response->nonReference, $response->referenceScore, $response->nonReferenceScore, $response->time, $response->comment);
	  
	  	array_push($bs1116CsvData, $results); 
		  
	    // array_push($bs1116CsvData, array($session->testId, $session->participant->email, $session->participant->age, $session->participant->gender, $trial->id, $response->reference, $response->nonReference, $response->referenceScore, $response->nonReferenceScore, $response->time, $response->comment));    
	  }
  }
}

if ($write_bs1116) {
	$filename = $filepathPrefix."bs1116".$filepathPostfix;
	$isFile = is_file($filename);
	$fp = fopen($filename, 'a');
	foreach ($bs1116CsvData as $row) {
		if ($isFile) {	    	
			$isFile = false;
		} else {
		   fputcsv($fp, $row);
		}
	}
	fclose($fp);
}

//lms

$write_lms = false;
$lmsCSVdata = array();
// array_push($lmsCSVdata, array("session_test_id", "participant_email", "participant_age", "participant_gender", "trial_id", "stimuli_rating", "stimuli", "rating_time"));

$input = array("session_test_id");
for($i =0; $i < $length; $i++){
	array_push($input, $session->participant->name[$i]);
}
array_push($input,  "trial_id", "stimuli_rating", "stimuli", "rating_time");
array_push($lmsCSVdata, $input);


foreach($session->trials as $trial) {
	if($trial->type == "likert_multi_stimulus") {
		foreach ($trial->responses as $response) {
			$write_lms = true; 
			
			$results = array($session->testId);
			for($i =0; $i < $length; $i++){
				array_push($results, $session->participant->response[$i]);
			}  
			array_push($results,  $trial->id, " $response->stimulusRating ", $response->stimulus, $response->time);
		  
		  	array_push($lmsCSVdata, $results); 
			
			// array_push($lmsCSVdata, array($session->testId, $session->participant->email, $session->participant->age, $session->participant->gender, $trial->id, " $response->stimuliRating ", $response->stimuli, $response->time));
		}
	}
}

if($write_lms){
	$filename = $filepathPrefix."lms".$filepathPostfix;
	$isFile = is_file($filename); 
	$fp = fopen($filename, 'a');
	foreach($lmsCSVdata as $row){
		if ($isFile){
			$isFile = false; 
		} else {
			fputcsv($fp,$row);
		}
	}
	fclose($fp);
}


//lss


$write_lss = false;
$lssCSVdata = array();
// array_push($lssCSVdata, array("session_test_id", "participant_email", "participant_age", "participant_gender", "trial_id", "stimuli_rating", "stimuli", "rating_time"));

$input = array("session_test_id");
for($i =0; $i < $length; $i++){
	array_push($input, $session->participant->name[$i]);
}
array_push($input,  "trial_id", "stimuli_rating", "stimuli", "rating_time");
array_push($lssCSVdata, $input);

foreach($session->trials as $trial) {
	
	if($trial->type == "likert_single_stimulus") {
		foreach ($trial->responses as $response) {
			$write_lss = true; 
			
				$results = array($session->testId);
			for($i =0; $i < $length; $i++){
				array_push($results, $session->participant->response[$i]);
			}  
			array_push($results,  $trial->id, " $response->stimulusRating ", $response->stimulus, $response->time);
		  
		  	array_push($lssCSVdata, $results); 
			
			// array_push($lssCSVdata, array($session->testId, $session->participant->email, $session->participant->age, $session->participant->gender, $trial->id, " $response->stimulusRating ", $response->stimulus, $response->time));
		}
	}
}

if($write_lss){
	$filename = $filepathPrefix."lss".$filepathPostfix;
	$isFile = is_file($filename); 
	$fp = fopen($filename, 'a');
	foreach($lssCSVdata as $row){
		if ($isFile){
			$isFile = false; 
		} else {
			fputcsv($fp,$row);
		}
	}
	fclose($fp);
}



?>