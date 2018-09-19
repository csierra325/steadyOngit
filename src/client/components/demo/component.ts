import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'demo-component',
    styleUrls: ['./styles.scss'],
    templateUrl: './template.html'
})
export class DemoComponent implements OnInit {

    isLoading = false; 

    hobbies: any[];
    shortUrl: any[];

    constructor(){
        console.log("constructor ran..")
    }
    ngOnInit(){
        console.log("ngOnInit")
        this.hobbies = ["hello type url and press enter"] 
       
         

        
    }
   
    title = "app works!loolllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll"
   
   
    addHobby(hobby){
        console.log(hobby)
        this.hobbies.push(hobby)
        let lettersInUrl = [];
        let numberInUrl = 0;
        lettersInUrl = hobby.split("");
        numberInUrl = lettersInUrl.length;
        console.log(numberInUrl)

        if (numberInUrl < 45){

            return numberInUrl
            
            
        } else{
            // hobby.replace("'https://'" + this.makeShort() );
            alert("its too long")
           console.log("'https://'" + this.makeShort() )

        }
        return false;
    } 


    deleteHobby(hobby){
        for(let i = 0; i < this.hobbies.length; i++){
            if(this.hobbies[i] == hobby){
                this.hobbies.splice(i, 1);
            }
        }
    }

     makeShort() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
        
      }
      
    

}
