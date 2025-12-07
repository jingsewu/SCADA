import schema2component from "@/utils/schema2component";
import { api_crud_search } from "@/pages/constantApi";

// CRUD 表格列配置
const crudColumns = [
    {
        name: "dvcNo",
        label: "dvc编号",
        searchable: {
            type: "input-text",
            placeholder: "请输入dvc编号"
        }
    },
    {
        name: "scannerNo",
        label: "扫码器编号",
        searchable: {
            type: "input-text",
            placeholder: "请输入扫码器编号"
        }
    },
    {
        name: "flowTotal",
        label: "流量总计",
        sortable: true
    },
    {
        type: "operation",
        label: "操作",
        buttons: [
            {
                type: "button",
                label: "查看",
                actionType: "dialog",
                dialog: {
                    title: "详情",
                    body: [
                        {
                            type: "tpl",
                            tpl: "这里显示详细信息"
                        }
                    ]
                }
            }
        ]
    }
];

const searchIdentity = "ScanRateLog"; // 请根据实际情况修改

const schema = {
    type: "page",
    title: "扫码率统计",
    body: [
        {
            type: "crud",
            syncLocation: false,
            api: {
                ...api_crud_search,
                adapt: (payload: any) => ({
                    ...payload,
                    searchIdentity: searchIdentity
                })
            },
            columns: crudColumns,
            columnsTogglable: false,
            headerToolbar: [
                {
                    type: "export-excel"
                },
                {
                    type: "reload"
                }
            ],
            footerToolbar: [
                "statistics",
                {
                    type: "pagination",
                    layout: "total, perPage, pager, goPage",
                    perPage: 10,
                    perPageAvailable: [10, 20, 50, 100],
                    showPageInput: true
                }
            ],
            // 添加自动生成的筛选器
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            features: ["create", "filter", "view", "update", "delete", "bulkDelete"]
        }
    ]
};

export default schema2component(schema);
