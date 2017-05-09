import { Component, DoCheck } from '@angular/core';
import { SnapShotService, TrackedData, Table} from './snapshot.service';
import { EntityService, Entity, ShowEntities, Show} from './entity.service';
import { LoginService } from './login.service';

@Component({
    selector: 'mainbody',
    templateUrl: './mainbody.component.html',
})
export class MainBody implements DoCheck {
    shows: Show[];
    currentShow: string;
    
    //snapshot
    trackedData: TrackedData;
    currentTable: string;
    pullingSnapShot: Boolean=false;

    //entity
    entities : string[];
    entityData : ShowEntities;
    currentEntity: string;
    entityPullSize: Number = 1000;
    since : Number = 0;
    overrideHighestSysRowStampNum : Boolean;
    pullingEntity : Boolean = false;

    //pagination
    public currentPageSnapShot: number = 1;
    public itemsPerPageSnapShot: number = 200;    
    
    public currentPageEntity: number = 1;
    public itemsPerPageEntity: number = 200;

    private environment: string = null;;

    constructor(private loginService: LoginService, private snapShotService:SnapShotService, private entityService:EntityService)  {
        
        this.entities = entityService.getEntities();
    }

    //detect if environment has changed, load shows
    ngDoCheck() {
        if(this.loginService.IsLoggedIn() && this.loginService.environment != this.environment) {
            this.environment = this.loginService.environment;
            this.entityService.getShows().then(response => this.shows = response);
        }
    }

    showChanged() {
        this.trackedData = this.snapShotService.getLocalTrackedData(this.currentShow);
        this.entityData = this.entityService.getLocalEntityData(this.currentShow);
        if(this.currentEntity && this.entityData && this.entityData.Entities && this.entityData.Entities[this.currentEntity])
            this.since = this.entityData.Entities[this.currentEntity].getHighestSysRowStampNum();
        else 
            this.since = 0;
    }

    pullSnapShot() {

        this.pullingSnapShot = true;

        this.snapShotService.getServerTrackedData(this.currentShow)
            .then(response => {
                this.trackedData = response;
                this.pullingSnapShot = false;
            });
    }

    pullTableData() {
        this.snapShotService.getTableData(this.currentShow, this.currentTable);
        this.currentPageSnapShot = 1;
    }

    getSnapShotRows() {
        if(!this.trackedData || !this.currentTable || !this.trackedData.tablesMap[this.currentTable] || !this.trackedData.tablesMap[this.currentTable].Data)
            return null;

        let table = this.trackedData.tablesMap[this.currentTable];

        return table.FilteredData ? table.FilteredData : table.FilteredData = 
            table.Data.filter(row =>
                //For each field on the row, make sure every one either does not have a filter, or meets the filter requirements
                table.OrderedColumnSchema
                    .every(colName => 
                        !table.Filter[colName] ||
                        (row[table.OrderedColumnSchema.indexOf(colName)] &&
                         (row[table.OrderedColumnSchema.indexOf(colName)] + '').includes(table.Filter[colName]))
                )
            );
    }

    getEntityRows() {
        if(!this.entityData || !this.currentEntity || !this.entityData.Entities[this.currentEntity] || !this.entityData.Entities[this.currentEntity].data)
            return null;

        let entity =  this.entityData.Entities[this.currentEntity];

        return entity.filteredData ? entity.filteredData : entity.filteredData = 
               entity.data.filter((item, index) =>
                    //For each field on the row, make sure every one either does not have a filter, or meets the filter requirements
                    entity.getColumns()
                        .every((value, index, array) =>
                            !entity.filter[value] ||
                            (item[value] && (item[value] + '').includes(entity.filter[value]))
                    )        
               );
    }

    pullEntityData() {

        this.pullingEntity = true;

        this.entityService.getServerEntityData(this.currentShow, this.currentEntity, this.entityPullSize, this.since)
            .then(response => {
                this.entityData = response;
                this.since = this.entityData.Entities[this.currentEntity].getHighestSysRowStampNum();
                this.entityData.Entities[this.currentEntity].filteredData = null;
                this.pullingEntity = false;
            });
    }

    snapShotFiltersChanged() {
        this.trackedData.tablesMap[this.currentTable].FilteredData = null;
    }

    entityFiltersChanged() {
        this.entityData.Entities[this.currentEntity].filteredData = null;
    }

    entityChanged() {
        if(this.currentEntity && this.entityData && this.entityData.Entities && this.entityData.Entities[this.currentEntity])
            this.since = this.entityData.Entities[this.currentEntity].getHighestSysRowStampNum();
        else 
            this.since = 0;
    }
}