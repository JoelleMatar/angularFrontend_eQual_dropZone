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

		// this.http.post<any>('http://equal.local/?do=model_create&entity=core\\Image&fields[name]=' + this.files[0].name + '&fields[type]=' + this.files[0].type, { headers }).subscribe(data => {
		// 	this.files[0] = data;
		// 	console.log("hi");
		// })

		console.log("data", this.files[0]);

		

		try {
			const response = await this.api.create("core\\Image", {
				name: this.files[0].name,
				type: this.files[0].type,
				data: this.files
			})

			console.log("response", response);
		}
		catch (err) {
			console.log(err);
		}



		// const data= {
		// 	"entity": 'core\\Image',
		// 	"fields[name]": this.files[0].name
		// }



		// this.http.post<any>('http://equal.local/index.php?do=qinoa_model_create', data).subscribe(data => {
		// 	console.log("data ", data);
		// });
	}


	onRemove(event: File) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}
}
