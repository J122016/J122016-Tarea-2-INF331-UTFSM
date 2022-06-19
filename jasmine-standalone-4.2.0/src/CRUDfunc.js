function CRUDfunc() {
}

CRUDfunc.prototype.create = function(values) {
    //Dummy code, to implement
    this.entry = values.fieldName;
    this.isSave = true;
};

CRUDfunc.prototype.read = function(values) {
    //Dummy code, to implement
    this.isRead = true;
};

CRUDfunc.prototype.update = function(entry,values) {
    //Dummy code, to implement
    this.entry.field = values.fieldName;
    this.isSave = true;
};

CRUDfunc.prototype.delete = function(entry) {
    //Dummy code, to implement
    delete this.entry;
    this.isDelete = true;
};

