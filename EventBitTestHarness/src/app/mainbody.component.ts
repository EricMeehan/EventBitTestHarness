import { Component } from '@angular/core';
import { SnapShotService, Show, TrackedData, Table} from './snapshot.service';
import { EntityService, Entity, ShowEntities} from './entity.service';
import { LoginService } from './login.service';

@Component({
    selector: 'mainbody',
    templateUrl: './mainbody.component.html',
})
export class MainBody {
    shows: Show[];
    currentShow: string;
    
    //snapshot
    trackedData: TrackedData;
    currentTable: string;

    //entity
    entities : string[];
    entityData : ShowEntities;
    currentEntity: string;
    entityPullSize: Number = 1000;

    //pagination
    public currentPageSnapShot: number = 1;
    public itemsPerPageSnapShot: number = 200;    
    
    public currentPageEntity: number = 1;
    public itemsPerPageEntity: number = 200;

    constructor(private loginService: LoginService, private snapShotService:SnapShotService, private entityService:EntityService) {
        this.shows = snapShotService.getShows();
        this.entities = entityService.getEntities();
    }

    showChanged() {
        this.trackedData = this.snapShotService.getLocalTrackedData(this.currentShow);
        this.entityData = this.entityService.getLocalEntityData(this.currentShow);
    }

    pullSnapShot() {
        this.snapShotService.getServerTrackedData(this.currentShow)
            .then(response => this.trackedData = response );
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
        this.entityService.getServerEntityData(this.currentShow, this.currentEntity, this.entityPullSize)
            .then(response => 
            this.entityData = response
            );
    }

    snapShotFiltersChanged() {
        this.trackedData.tablesMap[this.currentTable].FilteredData = null;
    }

    entityFiltersChanged() {
        this.entityData.Entities[this.currentEntity].filteredData = null;
    }
}