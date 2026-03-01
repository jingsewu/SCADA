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
        label: "日志类型",
        searchable: {
            type: "select",
            name: "field1",
            clearable: true,
            options: [
                "收到货物上报",
                "货物到达上报",
                "目的地回复",
                "目的地请求"
            ],
            labelField: "label",
            valueField: "value"
        }
    },
    {
        name: "field2",
        label: "业务类型",
        searchable: {
            type: "select",
            clearable: true,
            options: ["出库", "分拣"]
        }
    },
    {
        name: "field3",
        label: "数据流向"
    },
    {
        name: "field4",
        label: "条码",
        searchable: {
            type: "input-text",
            placeholder: "请输入条码"
        }
    },
    {
        name: "field5",
        label: "实际地址"
    },
    {
        name: "field6",
        label: "BCR编号",
        searchable: {
            type: "input-text",
            placeholder: "请输入BCR编号"
        }
    },
    {
        name: "field11",
        label: "分拣结果",
        searchable: {
            type: "select",
            clearable: true,
            options: [] // 可动态获取
        }
    },
    {
        name: "field7",
        label: "包裹号"
    },
    {
        name: "field8",
        label: "设备编号"
    },
    {
        name: "field9",
        label: "高度"
    },
    {
        name: "field10",
        label: "DVC编号"
    },
    {
        name: "field12",
        label: "状态"
    }
];

const searchIdentity = "MConveyorLog"; // 用于后端接口标识，请根据实际情况修改

const schema = {
    type: "page",
    title: "WCS日志管理",
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
