import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";

// CRUD 表格列配置
const crudColumns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "field1",
        label: "scada.log.logType",
        searchable: {
            type: "select",
            name: "field1",
            clearable: true,
            options: [
                {label: "scada.log.logType.goodsReceived", value: "收到货物上报"},
                {label: "scada.log.logType.goodsArrived", value: "货物到达上报"},
                {label: "scada.log.logType.destReply", value: "目的地回复"},
                {label: "scada.log.logType.destRequest", value: "目的地请求"}
            ],
            labelField: "label",
            valueField: "value"
        }
    },
    {
        name: "field2",
        label: "scada.log.businessType",
        searchable: {
            type: "select",
            clearable: true,
            options: [
                {label: "scada.log.businessType.outbound", value: "出库"},
                {label: "scada.log.businessType.sorting", value: "分拣"}
            ]
        }
    },
    {
        name: "field3",
        label: "scada.log.dataFlow"
    },
    {
        name: "field4",
        label: "scada.log.barcode",
        searchable: {
            type: "input-text",
            placeholder: "scada.log.barcode.placeholder"
        }
    },
    {
        name: "field5",
        label: "scada.log.actualAddress"
    },
    {
        name: "field6",
        label: "scada.log.bcrNo",
        searchable: {
            type: "input-text",
            placeholder: "scada.log.bcrNo.placeholder"
        }
    },
    {
        name: "field11",
        label: "scada.log.sortingResult",
        searchable: {
            type: "select",
            clearable: true,
            options: [] // 可动态获取
        }
    },
    {
        name: "field7",
        label: "scada.log.packageNo"
    },
    {
        name: "field8",
        label: "scada.log.deviceNo"
    },
    {
        name: "field9",
        label: "scada.log.height"
    },
    {
        name: "field10",
        label: "scada.log.dvcNo"
    },
    {
        name: "field12",
        label: "scada.log.status"
    }
];

const searchIdentity = "MConveyorLog"; // 用于后端接口标识，请根据实际情况修改

const schema = {
    type: "page",
    title: "scada.log.pageTitle",
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "WCSLogTable",
            api: api_crud_search,
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: crudColumns,
                searchObject: {
                    orderBy: "id desc" // 默认按ID降序
                }
            },
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            columns: [
                ...crudColumns
            ],
            headerToolbar: [
                "export-excel",
                "reload"
            ],
            features: ["filter", "bulkDelete", "export"]
        }
    ]
};

export default schema2component(schema);
