import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from 'src/api/api.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'angular-dropzone';

	files: File[] = [];

	constructor(private http: HttpClient, private api: ApiService) { }

	async onSelect(event: { addedFiles: any; }) {
		console.log("event", event);
		this.files.push(...event.addedFiles);

		console.log("name ", this.files[0].name);
		console.log("data", this.files[0]);


		console.log("data", this.files);



		let blob = new Blob([this.files[0]], { type: this.files[0].type });
		console.log('Blob - ', blob);

		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			var base64String = reader.result;
			console.log('Base64 String - ', base64String);
		}

		console.log("new base64 _", reader);
		
		try {
			const response = await this.api.create("core\\Image", {
				name: this.files[0].name,
				type: this.files[0].type,
				data: reader.result
			})

			console.log("response", response);
		}
		catch (err) {
			console.log(err);
		}
	}


	onRemove(event: File) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}
}
