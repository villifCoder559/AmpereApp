# AmpereApp
The developed mobile app aims to offer a personal safety system for people who need assistance or who feel unsafe in particular circumstances. 
A collaborator has designed a PCB that sends a signal to the smartphone, which detects this signal, and sends an alert (with position, accelerometer data, velocity, 
and quote) to the central station where an operator will take charge of the emergency cases. The purpose of project Ampere is to design a platform for emergency cases. 
In urgent situations, the user presses the button behind the jewel to send a Bluetooth signal to the mobile APP, which communicates with the Snap4city server. 
In this way, the operator can monitor the alarm situation and call the involved people or public emergency contact like 112,115,118. 
This project uses the platform Sna4city as support for managing all data. Snap4city is an architecture that consists of a set of tools to cope with concepts such as 
collecting data, storing data, creating applications, creating services, and providing access. In this project, I took advantage of effective data management. 

## Alert Case
When the user presses the button, the compacted platform sends a signal that the app will detect, and it initiates the process of sending an alarm, as demonstrated in Figure 1
* It starts background geolocation, and it activates sensors (accelerometer)
* When the timer expires, (or the user clicks "send emergency immediately") app gets the last position provided by GPS and sends the alert to the AlertEvent device in snap4city
* App also enables a timer that checks the position every 5 seconds for the next 3 minutes, and if the sent distance differs more than 100m from the new position, the app will send another alert and restart this procedure.
* In case of failure, there is a procedure when the app sends the emergency alert: there are 5 more attempts. Each of them is computed after 4 seconds from the previous. 
Below there is the alert flow chart
<img src="https://user-images.githubusercontent.com/1312740/189374219-510b5151-4ca3-4f8e-a723-4a9e74d78742.png" alt="Flow chart Alert" width="60%">

## NFC/QR Scan

When users get the text from a tag NFC or QR code, the app searches the UUID in the data available on the smartphone (loaded when the user logged in). 
If there is no matched code, the app will download the updated data from the server. If the code is still not found, the app will check in 
the operator's public dictionary. When the app recognizes the UUID, the linked content will be opened in the app, and the app sends a QR/NFC Event 
to record the code scanned by the user as shown in below.
The Scan flow chart is the following:

<img src="https://user-images.githubusercontent.com/1312740/189375125-7ea3a393-e2de-410c-b00f-c2546c17f165.png" alt="Flow chart Scan" width="60%">

## User Registration
After the user has fulfilled the registration form, the app gets all data from the form and checks if they are correct. 
Then, it creates three devices (Profile, QRNFCEvent, and AlertEvent) and stores the user's data into the device Profile. 
If there is an error in the form group, the user must correct it. If something goes wrong (connection_error, etc.)  during the creation 
of the devices, the app will delete the other devices created (if present) but retains the data locally in the app (until the user closes the app).
The flow chart is the following: 
<img src="https://user-images.githubusercontent.com/1312740/189375464-78cda1be-7b6b-435f-9bde-dafd382dc3c7.png" alt="Flow chart registration" width="60%">

## Snapshots
<img src="https://user-images.githubusercontent.com/1312740/189379876-56d86031-42a9-45b1-876a-e15b220e218e.png" width="20%"><!-- login_page -->
<img src="https://user-images.githubusercontent.com/1312740/189379663-cc0f1729-ae1b-42c0-a01d-2712db7030a5.png" width="20%"><!-- tutorial1 -->
<img src="https://user-images.githubusercontent.com/1312740/189379735-21ae2858-00fc-432d-b269-5c5c2c9b6ddc.png" width="20%"><!-- tutorial2 -->  
<img src="https://user-images.githubusercontent.com/1312740/189379769-bef5e836-d858-4e46-9645-6e3b9b1ff982.png" width="20%"><!-- tutorial3 -->
<img src="https://user-images.githubusercontent.com/1312740/189379831-39cec95b-7989-486a-adc8-cade2149d49a.png" width="20%"><!-- home_page -->
<img src="https://user-images.githubusercontent.com/1312740/189379958-a005249d-3312-4b80-b49d-f1d71740db02.png" width="20%"><!-- emergenza -->
<img src="https://user-images.githubusercontent.com/1312740/189379860-df21a346-5199-42d5-bda5-f41d17a28820.png" width="20%"><!-- profilo -->
<img src="https://user-images.githubusercontent.com/1312740/189379937-e691c10d-7bf8-40b5-bd03-580e88cc3d2e.png" width="20%"><!-- lettore_qr -->
