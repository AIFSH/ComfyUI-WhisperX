import { app } from "../../../scripts/app.js";
import { api } from '../../../scripts/api.js'

function fitHeight(node) {
    node.setSize([node.size[0], node.computeSize([node.size[0], node.size[1]])[1]])
    node?.graph?.setDirtyCanvas(true);
}
function chainCallback(object, property, callback) {
    if (object == undefined) {
        //This should not happen.
        console.error("Tried to add callback to non-existant object")
        return;
    }
    if (property in object) {
        const callback_orig = object[property]
        object[property] = function () {
            const r = callback_orig.apply(this, arguments);
            callback.apply(this, arguments);
            return r
        };
    } else {
        object[property] = callback;
    }
}

function addPreviewOptions(nodeType,srt_name,dir_name) {
    chainCallback(nodeType.prototype, "getExtraMenuOptions", function(_, options) {
        // The intended way of appending options is returning a list of extra options,
        // but this isn't used in widgetInputs.js and would require
        // less generalization of chainCallback
        let optNew = []
        try {
            const previewWidget = this.widgets.find((w) => w.name === "srtpreview");

            let url = null
            let params =  {
                "filename": srt_name,
                "type": dir_name,
            }
            if (previewWidget.srtEl?.hidden == false) {
                //Use full quality audio
                //url = api.apiURL('/view?' + new URLSearchParams(previewWidget.value.params));
                url = api.apiURL('/view?' + new URLSearchParams(params));
            }
            if (url) {
                optNew.push(
                    {
                        content: "Open preview",
                        callback: () => {
                            window.open(url, "_blank")
                        },
                    },
                    {
                        content: "Save preview",
                        callback: () => {
                            const a = document.createElement("a");
                            a.href = url;
                            a.setAttribute("download", new URLSearchParams(previewWidget.value.params).get("filename"));
                            document.body.append(a);
                            a.click();
                            requestAnimationFrame(() => a.remove());
                        },
                    }
                );
            }
            if(options.length > 0 && options[0] != null && optNew.length > 0) {
                optNew.push(null);
            }
            options.unshift(...optNew);
            
        } catch (error) {
            console.log(error);
        }
        
    });
}
function previewSRT(node,srt_text){
    var element = document.createElement("div");
    const previewNode = node;
    var previewWidget = node.addDOMWidget("srtpreview", "preview", element, {
        serialize: false,
        hideOnZoom: false,
        getValue() {
            return element.value;
        },
        setValue(v) {
            element.value = v;
        },
    });
    previewWidget.computeSize = function(width) {
        if (this.aspectRatio && !this.parentEl.hidden) {
            let height = (previewNode.size[0]-20)/ this.aspectRatio + 10;
            if (!(height > 0)) {
                height = 0;
            }
            this.computedHeight = height + 10;
            return [width, height];
        }
        return [width, -4];//no loaded src, widget should not display
    }
    // element.style['pointer-events'] = "none"
    previewWidget.value = {hidden: false, paused: false, params: {}}
    previewWidget.parentEl = document.createElement("div");
    previewWidget.parentEl.className = "audio_preview";
    previewWidget.parentEl.style['width'] = "100%"
    element.appendChild(previewWidget.parentEl);
    previewWidget.srtEl = document.createElement("p");
    previewWidget.srtEl.style['width'] = "100%"
    previewWidget.srtEl.addEventListener("loadedmetadata", () => {

        previewWidget.aspectRatio = previewWidget.srtEl.srtWidth / previewWidget.srtEl.srtHeight;
        fitHeight(this);
    });
    previewWidget.srtEl.addEventListener("error", () => {
        //TODO: consider a way to properly notify the user why a preview isn't shown.
        previewWidget.parentEl.hidden = true;
        fitHeight(this);
    });

    previewWidget.srtEl.innerText = srt_text
    
    previewWidget.parentEl.hidden = previewWidget.value.hidden;
   

    previewWidget.srtEl.hidden = false;
    previewWidget.parentEl.appendChild(previewWidget.srtEl)
}

app.registerExtension({
	name: "WhisperX.SRTPreviewer",
	async beforeRegisterNodeDef(nodeType, nodeData, app) {
		if (nodeData?.name == "PreViewSRT") {
			nodeType.prototype.onExecuted = function (data) {
				previewSRT(this, data.srt[0]);
                console.log(data.srt);
                addPreviewOptions(nodeType,data.srt[1],data.srt[2])
			}
		}
	}
});