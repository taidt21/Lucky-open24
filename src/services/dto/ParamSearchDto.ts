export class ParamSearchDto {
    idChiNhanhs?: string[];
    textSearch?: string;
    currentPage? = 1;
    pageSize? = 10;
    columnSort?: string;
    typeSort?: string;

    constructor({
        idChiNhanhs = [],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC'
    }) {
        this.idChiNhanhs = idChiNhanhs;
        this.textSearch = textSearch;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.columnSort = columnSort;
        this.typeSort = typeSort;
    }
}

export class RequestFromToDto extends ParamSearchDto {
    fromDate?: string | null = null;
    toDate?: string | null = null;

    constructor({
        idChiNhanhs = [],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null
    }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch,
            currentPage: currentPage,
            pageSize: pageSize,
            columnSort: columnSort,
            typeSort: typeSort
        });
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
}

export class HoaDonRequestDto extends RequestFromToDto {
    idLoaiChungTus?: string[];

    constructor({
        idChiNhanhs = [],
        textSearch = '',
        currentPage = 0,
        pageSize = 10,
        columnSort = '',
        typeSort = 'DESC',
        fromDate = null,
        toDate = null,
        idLoaiChungTus = []
    }) {
        super({
            idChiNhanhs: idChiNhanhs,
            textSearch: textSearch,
            currentPage: currentPage,
            pageSize: pageSize,
            columnSort: columnSort,
            typeSort: typeSort,
            fromDate: fromDate,
            toDate: toDate
        });
        this.idLoaiChungTus = idLoaiChungTus;
    }
}
