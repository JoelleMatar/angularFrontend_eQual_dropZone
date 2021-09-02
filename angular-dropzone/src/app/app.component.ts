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

    columns = ["ID", "Image Name"];
    index = ["id", "name"];

    files: any[] = [];

    loading = false;
    removeFromDZ = false;
    renameFile = false;

    name: string = '';

    chosenRow: any;



    constructor(private api: ApiService) { }

    ngOnInit() {
        this.load();
    }

    public async onSelect(event: { addedFiles: any; }) {
        console.log("event", event.addedFiles);

        let file = event.addedFiles;
        this.loading = true;



        for (var i = 0; i < file.length; i++) {
            const data = await this.readFile(file[i]);
            try {
                const response = await this.api.create("core\\Image", {
                    name: file[i].name,
                    type: file[i].type,
                    data: data
                });

                file.id = response.id;

                this.files.push(file[i]);
                // this.onRemove(file[i]);
                this.load();

                // if (response) {
                    
                //     this.removeFromDZ = true;
                // }
            }
            catch (err) {
                console.log(err);
            }
        }this.loading = false;
    }


    onRemove(file: File) {
        this.files.splice(this.files.indexOf(file), 1);
    }

    async load() {
        try {
            this.files = await this.api.fetch("/images");

            console.log("fetch response", this.files);
        }
        catch (err) {
            console.log("err fetch", err);
        }
    }

    async onDelete(file: any) {
        try {
            // permanent deletion
            await this.api.remove("core\\Image", [file.id], true);

            let index = this.files.findIndex((f: any) => f.id == file.id);
            this.files.splice(index, 1);
        }
        catch (err) {
            console.log("err delete", err);
        }
    }


    private readFile(file: any) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            let blob = new Blob([file], { type: file.type });
            reader.onload = () => {
                console.log(reader.result)
                resolve(reader.result);
            }
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    addInput(file: any) {
        console.log("file", file);
        this.renameFile = true;

        this.chosenRow = file;
    }

    async rename(file: any) {
        this.renameFile = true;
        console.log("name", name);

        console.log("fileee", file);
        try {
            // 

            // if (this.renameFile == true) {


            const response = await this.api.update("core\\Image", [file.id], { name: this.name }, true);

            if (response) {
                this.load();
                this.renameFile = false;
                console.log("update success");

            }
            // }



        }
        catch (err) {
            console.log("err update", err);
        }

    }
}
