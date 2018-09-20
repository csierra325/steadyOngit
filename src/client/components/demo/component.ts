import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'demo-component',
    styleUrls: ['./styles.scss'],
    templateUrl: './template.html'
})
export class DemoComponent implements OnInit {

    isLoading = false; 

    links: any[];
    shortUrl: any[];

    constructor(){
        console.log("constructor ran..")
    }
    ngOnInit(){
        console.log("ngOnInit")
        this.links = [] 
    
        
    }
   
    // title = "app works!" (if else statement test)
   
   
    addUrl(link){
        console.log(link)
        this.links.push(link)
        let lettersInUrl = [];
        let numberInUrl = 0;
        lettersInUrl = link.split("");
        numberInUrl = lettersInUrl.length;
        console.log(numberInUrl)

        if (numberInUrl < 45){

            return numberInUrl
            
            
        } else{
            // link.replace("'https://'" + this.makeShort() );
            alert("its too long")
           console.log("'https://'" + this.makeShort() )

        }
        return false;
    } 


    deleteUrl(link){
        for(let i = 0; i < this.links.length; i++){
            if(this.links[i] == link){
                this.links.splice(i, 1);
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
