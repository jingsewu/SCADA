import schema2component from "@/utils/schema2component"
import {
    api_api_add,
    api_api_config_get,
    api_api_config_update,
    api_api_delete, api_api_get,
    api_api_update,
    editorDidMount
} from "@/pages/api_platform/constants/api_constant"
import {create_update_columns, true_false_options} from "@/utils/commonContants"
import {api_crud_search, api_crud_search_total} from "@/pages/constantApi"

const baseform = [
    {
        type: "hidden",
        name: "id"
    },
    {
        label: "interfacePlatform.interfaceManagement.table.interfaceCode",
        type: "input-text",
        name: "code",
        required: true
    },
    {
        label: "interfacePlatform.interfaceManagement.table.interfaceName",
        type: "input-text",
        name: "name",
        required: true
    },
    {
        label: "interfacePlatform.interfaceManagement.table.interfaceType",
        type: "select",
        name: "apiType",
        source: "${dictionary.ApiCallType}",
        required: true
    },
    {
        type: "switch",
        name: "enabled",
        label: "interfacePlatform.configuration.enableConfig",
        value: true
    },
    {
        type: "switch",
        name: "syncCallback",
        label: "interfacePlatform.configuration.syncCallback",
        value: true
    },
    {
        type: "select",
        name: "protocol",
        label: "interfacePlatform.configuration.protocolType",
        required: true,
        options: [
            {label: "HTTP", value: "HTTP"},
            {label: "TCP", value: "TCP"}
        ],
        value: "HTTP",
        visibleOn: "data.apiType === 'CALLBACK'"
    },
    {
        type: "tabs",
        visibleOn: "data.apiType === 'CALLBACK'",
        tabs: [
            {
                title: "interfacePlatform.configuration.httpConfig",
                body: [
                    {
                        type: "input-text",
                        name: "protocolConfig.url",
                        label: "interfacePlatform.configuration.apiUrl",
                        required: true,
                        validations: {
                            isUrl: true
                        }
                    },
                    {
                        type: "select",
                        name: "protocolConfig.method",
                        label: "interfacePlatform.configuration.httpMethod",
                        value: "GET",
                        options: [
                            "get",
                            "post"
                        ]
                    },
                    {
                        type: "input-text",
                        name: "protocolConfig.encoding",
                        label: "interfacePlatform.configuration.encoding",
                        value: "UTF-8"
                    },
                    {
                        type: "combo",
                        name: "protocolConfig.headers",
                        label: "interfacePlatform.configuration.headers",
                        multiple: true,
                        items: [
                            {
                                type: "input-text",
                                name: "key",
                                placeholder: "interfacePlatform.configuration.headerName"
                            },
                            {
                                type: "input-text",
                                name: "value",
                                placeholder: "interfacePlatform.configuration.headerValue"
                            }
                        ]
                    },
                    {
                        type: "input-number",
                        name: "protocolConfig.timeoutMillis",
                        label: "interfacePlatform.configuration.timeout",
                        min: 1000,
                        value: 10000
                    },
                    {
                        type: "switch",
                        name: "protocolConfig.enableAuth",
                        label: "interfacePlatform.configuration.enableAuth",
                        value: false
                    },
                    {
                        type: "container",
                        visibleOn: "data.protocolConfig.enableAuth",
                        body: [
                            {
                                type: "input-text",
                                name: "protocolConfig.authConfig.authUrl",
                                label: "interfacePlatform.configuration.authUrl",
                                required: true
                            },
                            {
                                type: "select",
                                name: "protocolConfig.authConfig.grantType",
                                label: "interfacePlatform.configuration.grantType",
                                options: [
                                    {label: "interfacePlatform.auth.clientCredentials", value: "client_credentials"},
                                    {label: "interfacePlatform.auth.password", value: "password"}
                                ]
                            }
                        ]
                    }
                ],
                visibleOn: "data.protocol === 'HTTP'"
            },
            {
                title: "interfacePlatform.configuration.tcpConfig",
                body: [
                    {
                        type: "input-text",
                        name: "protocolConfig.host",
                        label: "interfacePlatform.configuration.host",
                        required: true
                    },
                    {
                        type: "input-number",
                        name: "protocolConfig.port",
                        label: "interfacePlatform.configuration.port",
                        required: true,
                        min: 1,
                        max: 65535
                    },
                    {
                        type: "input-text",
                        name: "protocolConfig.delimiter",
                        label: "interfacePlatform.configuration.messageDelimiter",
                        value: "\\n"
                    },
                    {
                        type: "input-number",
                        name: "protocolConfig.maxConnections",
                        label: "interfacePlatform.configuration.maxConnections",
                        min: 1,
                        value: 10
                    },
                    {
                        type: "switch",
                        name: "protocolConfig.ssl.enabled",
                        label: "interfacePlatform.configuration.enableSSL",
                        value: false
                    },
                    {
                        type: "container",
                        visibleOn: "data.protocolConfig.ssl.enabled",
                        body: [
                            {
                                type: "input-text",
                                name: "protocolConfig.ssl.protocol",
                                label: "interfacePlatform.configuration.sslProtocol"
                            },
                            {
                                type: "input-text",
                                name: "protocolConfig.ssl.truststorePath",
                                label: "interfacePlatform.configuration.truststorePath"
                            },
                            {
                                type: "input-text",
                                name: "protocolConfig.ssl.keystorePath",
                                label: "interfacePlatform.configuration.keystorePath"
                            }
                        ]
                    }
                ],
                visibleOn: "data.protocol === 'TCP'"
            }
        ]
    }
]

const configForm = [
    {
        label: "interfacePlatform.interfaceManagement.table.interfaceCode",
        type: "input-text",
        name: "code",
        readOnly: true
    },
    {
        label: "interfacePlatform.interfaceManagement.form.converseScriptType",
        type: "select",
        name: "paramConverterType",
        source: "${dictionary.ConverterType}",
        required: true
    },
    {
        label: "interfacePlatform.interfaceManagement.form.requestTransformationScript",
        type: "editor",
        size: "lg",
        name: "jsParamConverter",
        description:
            "interfacePlatform.interfaceManagement.form.requestTransformationScript.description",
        visibleOn: "${paramConverterType == 'JAVA'}",
        language: "java",
        placeholder: "Enter your java code here and named function as convert. for example: \n" +
            "                //java:convert \n" +
            "                public class MyClass { \n" +
            "                    public Object convert(Object param) {\n" +
            "                        Map<String, Object> input = (Map<String, Object>) param;\n" +
            "                        return \"Hello,  \"+ input.get(\"name\");\n" +
            "                    }\n" +
            "                }\n" +
            "                \"\"\"",
        options: {
            automaticLayout: true,
            lineNumbers: true,
            autofocus: true,
            lineHeight: 24,
            theme: "vs-dark", // Dark theme for the editor
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            wordWrap: "on",
        },
        // editorDidMount: editorDidMount
    },
    {
        label: "interfacePlatform.interfaceManagement.form.requestTransformationScript",
        type: "textarea",
        name: "templateParamConverter",
        visibleOn: "${paramConverterType == 'TEMPLATE'}"
    },
    {
        label: "interfacePlatform.interfaceManagement.form.responseTransformationScriptType",
        type: "select",
        name: "responseConverterType",
        source: "${dictionary.ConverterType}",
        required: true
    },
    {
        label: "interfacePlatform.interfaceManagement.form.responseTransformationScripts",
        type: "editor",
        name: "jsResponseConverter",
        visibleOn: "${responseConverterType == 'JAVA'}",
        language: "java",
        placeholder: "Enter your java code here and named function as convert. for example: \n" +
            "                //java:convert \n" +
            "                public class MyClass { \n" +
            "                    public Object convert(Object param) {\n" +
            "                        Map<String, Object> input = (Map<String, Object>) param;\n" +
            "                        return \"Hello,  \"+ input.get(\"name\");\n" +
            "                    }\n" +
            "                }\n" +
            "                \"\"\"",
        options: {
            automaticLayout: true,
            lineNumbers: true,
            autofocus: true,
            lineHeight: 24,
            theme: "vs-dark", // Dark theme for the editor
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            wordWrap: "on",
        },
        // editorDidMount: editorDidMount
    },
    {
        label: "interfacePlatform.interfaceManagement.form.responseTransformationScripts",
        type: "textarea",
        name: "templateResponseConverter",
        visibleOn: "${responseConverterType == 'TEMPLATE'}"
    }
]

const add = {
    type: "button",
    actionType: "drawer",
    icon: "fa fa-plus",
    label: "button.add",
    target: "ApiTable",
    drawer: {
        size: "lg",
        title: "button.add",
        closeOnEsc: true,
        body: {
            type: "form",
            api: api_api_add,
            body: baseform
        }
    }
}

const columns = [
    {
        name: "id",
        label: "ID",
        hidden: true
    },
    {
        name: "code",
        label: "interfacePlatform.interfaceManagement.table.interfaceCode",
        searchable: true
    },
    {
        name: "name",
        label: "interfacePlatform.interfaceManagement.table.interfaceName",
        searchable: true
    },
    {
        name: "apiType",
        label: "interfacePlatform.interfaceManagement.table.interfaceType",
        type: "mapping",
        source: "${dictionary.ApiCallType}",
        searchable: {
            type: "select",
            source: "${dictionary.ApiCallType}"
        }
    },
    {
        name: "enabled",
        label: "table.whetherEnabled",
        type: "mapping",
        map: true_false_options
    },
    {
        name: "syncCallback",
        label: "table.syncCallback",
        type: "mapping",
        map: true_false_options
    },
    ...create_update_columns
]

const searchIdentity = "AApi"
const showColumns = columns

const schema = {
    type: "page",
    title: "interfacePlatform.interfaceManagement.title",
    toolbar: [],
    data: {
        dictionary: "${ls:dictionary}"
    },
    body: [
        {
            type: "crud",
            syncLocation: false,
            name: "ApiTable",
            api: api_crud_search,
            defaultParams: {
                searchIdentity: searchIdentity,
                showColumns: showColumns,
                searchObject: {
                    orderBy: "update_time desc"
                }
            },
            autoFillHeight: true,
            autoGenerateFilter: {
                columnsNum: 3,
                showBtnToolbar: true
            },
            headerToolbar: [
                "reload",
                add,
                {
                    type: "export-excel",
                    label: "button.export",
                    method: "POST",
                    api: api_crud_search_total,
                    columns: [
                        "code",
                        "name",
                        "apiType",
                        "method",
                        "format",
                        "encoding",
                        "auth",
                        "enabled"
                    ],
                    filename: "api",
                    defaultParams: {
                        searchIdentity: searchIdentity,
                        showColumns: showColumns
                    }
                }
            ],
            footerToolbar: ["switch-per-page", "statistics", "pagination"],
            columns: [
                ...columns,
                {
                    type: "operation",
                    label: "table.operation",
                    width: 230,
                    buttons: [
                        {
                            label: "button.modify",
                            type: "button",
                            actionType: "drawer",
                            drawer: {
                                title: "button.modify",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                body: {
                                    type: "form",
                                    initApi: api_api_get,
                                    api: api_api_update,
                                    body: baseform
                                }
                            }
                        },
                        {
                            label: "interfacePlatform.interfaceManagement.button.parameterConversionConfiguration",
                            type: "button",
                            actionType: "dialog",
                            dialog: {
                                title: "interfacePlatform.interfaceManagement.dialog.modifyParameterConversionConfiguration",
                                closeOnEsc: true,
                                closeOnOutside: true,
                                size: "xl",
                                body: {
                                    type: "form",
                                    initApi: "/api-platform/api-config-management/${code}",
                                    data: {
                                        code: "${code}", // Explicitly map the code from row data
                                    },
                                    api: api_api_config_update,
                                    body: configForm
                                }
                            }
                        },
                        {
                            label: "button.delete",
                            type: "button",
                            actionType: "ajax",
                            level: "danger",
                            confirmText: "toast.sureDelete",
                            confirmTitle: "button.delete",
                            api: api_api_delete,
                            reload: "ApiTable"
                        }
                    ],
                    toggled: true
                }
            ]
        }
    ]
}

export default schema2component(schema)
