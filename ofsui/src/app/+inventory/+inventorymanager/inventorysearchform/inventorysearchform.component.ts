import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventorysearchform',
  templateUrl: './inventorysearchform.component.html'
})
export class InventorysearchformComponent implements OnInit {

  public name;
  public type;
  public quantity;
  public price;
  public description;
  public propName;

  constructor() { }

  ngOnInit() {
  }

  public changed(text: string) {
    console.log("Name: " + this.name);
    console.log("Type: " + this.type);
    console.log("Quantity: " + this.quantity);
    console.log("Price: " + this.price);
    console.log("Description: " + this.description);
    console.log("Prop Name: " + this.propName);
  }

}
