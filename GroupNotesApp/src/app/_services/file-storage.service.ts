import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { NotesList } from '../_models/notesList.model';
import { GroupUrl } from '../_models/groupUrl.model';
import { FileUrl } from '../_models/fileUrl.model';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { ImagePopoverComponent } from '../_components/image-popover/image-popover.component';
import { UtilitiesService } from '../_services/utilities.service';

@Injectable({
  providedIn: 'root'
})

export class FileStorageService {
  constructor(private http: HttpClient, private transfer: FileTransfer, private platform: Platform, 
    public popoverController: PopoverController, private file: File, private utilitiesService: UtilitiesService) { 
  }

  // Upload a file method, which creates a XMLHttpRequest and posts it to the server
  // I tried using the fileTransfer plugin initally but I couldn't get it working
  // and it has been recently depricated. From research using a XMLHttpRequest is the new supported way.
  uploadFile(file: any, groupId: string): Observable<any> {
    let req = new XMLHttpRequest();
    let formData = new FormData();

    const date = new Date();
    
    // add file and group id, to be accessed by the server
    formData.append("fileUpload", file);
    formData.append("groupId", groupId);
    formData.append("dateTime", date.toLocaleString());
    
    //Post request to server on virtual machine
    req.open("POST", 'http://52.51.181.253:3000/api/files');
    req.send(formData);

    return req.response;
  }

  // Download or view files
  downloadViewFile(url: string, type: string, fileName: string){
    this.platform.ready().then(() => {
      // Create file object
      let file: any = {"url": url, "fileName": fileName};

      if (this.platform.is('mobile')) {
        // If it's an image display a popover viewer so the user can see the image 
        if (type == 'image/png' || type == 'image/jpeg' || type == 'image/gif'){
          this.presentPopover(event, file);
        }
        else {
          // Download file to device
          this.downloadToDevice(file);
        }
      }

      // If on desktop
      if (this.platform.is('desktop')) {
        // If it's an image display a popover viewer so the user can see the image 
        if (type == 'image/png' || type == 'image/jpeg' || type == 'image/gif'){
          this.presentPopover(event, file);
        }
        else {
          // Open the download link in the current window.
          window.location.assign(url);
        }
      }
   });
  }

  // Handles downloading the file to the downloads folder on device
  downloadToDevice(file: any){
    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.download(file.url, this.file.externalRootDirectory + '/Download/' + file.fileName).then((entry) => {
      this.utilitiesService.presentToast("Sucess, " + file.fileName + " is saved to downloads folder");
    }, (error) => {
      this.utilitiesService.presentToast("Error");
    });
  }

  // Load popover for images
  // From research of the Ionic docs I found you could pass data with componentProps however it was given me an error
  // I fixed this by adding <null> which I found at the link below, as it seems other people have encountered the same issue.
  // https://github.com/ionic-team/ionic/issues/16980
  async presentPopover(ev: any, file: any) {
    const popover = await this.popoverController.create({
      component: ImagePopoverComponent,
      event: ev,
      componentProps:<null>{"file": file},
      translucent: true,
    });

    return await popover.present();
  }

  // == Server Access == 
  // == FILES == 

  // Used to initalise list of download links on mlab using MongoDB
  // These links are used to display the files on the homepage.
  createGroupUrl(groupId: string): Observable<any>{
   
    // Set up intial empty array
    const urlList: FileUrl[] = [];

    const groupUrl: GroupUrl = { groupId: groupId, urlList: urlList};
 
    return this.http.post("http://52.51.181.253:3000/api/url", groupUrl);
  }

  // Get all files for a specific group from the server
  getFiles(groupId: String):Observable<any>{
    return this.http.get("http://52.51.181.253:3000/api/url/" + groupId);
  }

  //send a delete request to the server, which deletes a note
  deleteFile(_id: string, fileName: string, groupId: string):Observable<any>{
    return this.http.delete("http://52.51.181.253:3000/api/url/" + _id + "/" + fileName + "/" + groupId);
  }

  // == NOTES ==
  // Create a document in the database for a note.
  addNote(groupId: string, fileName: string, dateTime: string, text: string): Observable<any> {
    const note: NotesList = { groupId: groupId, fileName: fileName, dateTime: dateTime, text: text};

    return this.http.post("http://52.51.181.253:3000/api/notes", note);
  }

  // Update a selected note using the id
  updateNote(_id: string, groupId: string, fileName: string, dateTime: string, text: string): Observable<any> {
    const note: NotesList = { groupId: groupId, fileName: fileName, dateTime: dateTime, text: text};

    return this.http.put("http://52.51.181.253:3000/api/notes/" + _id, note);
  }

  // Send a delete request to the server, which deletes a note
  deleteNote(_id: string):Observable<any>{
    return this.http.delete("http://52.51.181.253:3000/api/notes/" + _id);
  }

  // Get all notes from the server
  getNotes(groupId: String):Observable<any>{
    return this.http.get("http://52.51.181.253:3000/api/notes/" + groupId);
  }

  // Get one specific note from the server, used when editing the notes
  getNote(_id: String):Observable<any>{
    return this.http.get("http://52.51.181.253:3000/api/note/" + _id);
  }
}
