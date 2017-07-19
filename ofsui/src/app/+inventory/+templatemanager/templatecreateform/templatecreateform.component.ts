import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-templatecreateform',
  templateUrl: './templatecreateform.component.html'
})
export class TemplatecreateformComponent implements OnInit {

  public templateCreateValidationOptions:any = {
    rules: {
      name: {
        required: true
      },
      propName: {
        required: true
      },
      propType: {
        required: true
      },
      propRequired: {
        required: true
      }
    },
    messages: {
      name: {
        required: 'Please provide a template name'
      },
      propName: {
        required: 'Please provide a template property name'
      },
      propType: {
        required: 'Please select a template property type'
      },
      propRequired: {
        required: 'Please select if template property is required'
      }
    }
  }

  public name;
  public propName;
  public propType;
  public propRequired;

  constructor() { }

  ngOnInit() {
  }

  submit(event) {
    console.log("Submitting Create Template")
    console.log("Name: " + this.name)
    console.log("PropName: " + this.propName)
    console.log("PropType: " + this.propType)
    console.log("PropRequired: " + this.propRequired)
  }


}
