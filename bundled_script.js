let comments_watcher_unbind,changes_watcher_unbind,chat_observer,colorscheme,lib_chartjs_loaded=!1;const appversion="1.6.2";try{angular}catch(e){if("ReferenceError"==e.name)throw new Error("Angular is not present on this page, Native Overleaf will not be active here")}let notificationCounter=0,lastNotificationResetTimestamp=Date.now(),lastChangeNotificationTimestamp=Date.now();const originalDocumentTitle=document.title;let current_colorscheme_preference;function getLocalDate(){return(new Date).toLocaleDateString("en-CA")}function recursiveCheckAndWait(checkFunction,waitTime,numberOfTimesToCheck,multiplyWaitTime=!1,numberOfTimesChecked=0){const checkFunctionResult=checkFunction();return numberOfTimesChecked+=1,0!=checkFunctionResult?checkFunctionResult:!(numberOfTimesToCheck-numberOfTimesChecked<=0)&&new Promise((resolve=>{1==multiplyWaitTime&&(waitTime*=numberOfTimesChecked),setTimeout((()=>{resolve(recursiveCheckAndWait(checkFunction,waitTime,numberOfTimesToCheck,multiplyWaitTime,numberOfTimesChecked))}),waitTime)}))}window.matchMedia&&(colorscheme=window.matchMedia("(prefers-color-scheme: dark)"),current_colorscheme_preference=colorscheme.matches?"dark":"light"),Storage.prototype.setObject=function(key,value){this.setItem(key,JSON.stringify(value))},Storage.prototype.getObject=function(key){const value=this.getItem(key);return value&&JSON.parse(value)};const deepDiffMapper={VALUE_CREATED:"created",VALUE_UPDATED:"updated",VALUE_DELETED:"deleted",VALUE_UNCHANGED:"---",map:function(obj1,obj2){if(this.isFunction(obj1)||this.isFunction(obj2))throw"Invalid argument. Function given, object expected.";if(this.isValue(obj1)||this.isValue(obj2)){let returnObj={type:this.compareValues(obj1,obj2),original:obj1,updated:obj2};return returnObj.type!=this.VALUE_UNCHANGED?returnObj:void 0}let diff={},foundKeys={};for(let key in obj1){if(this.isFunction(obj1[key]))continue;let value2;void 0!==obj2[key]&&(value2=obj2[key]);let mapValue=this.map(obj1[key],value2);foundKeys[key]=!0,mapValue&&(diff[key]=mapValue)}for(let key in obj2){if(this.isFunction(obj2[key])||void 0!==foundKeys[key])continue;let mapValue=this.map(void 0,obj2[key]);mapValue&&(diff[key]=mapValue)}if(Object.keys(diff).length>0)return diff},compareValues:function(value1,value2){return value1===value2||this.isDate(value1)&&this.isDate(value2)&&value1.getTime()===value2.getTime()?this.VALUE_UNCHANGED:void 0===value1?this.VALUE_CREATED:void 0===value2?this.VALUE_DELETED:this.VALUE_UPDATED},isFunction:function(x){return"[object Function]"===Object.prototype.toString.call(x)},isArray:function(x){return"[object Array]"===Object.prototype.toString.call(x)},isDate:function(x){return"[object Date]"===Object.prototype.toString.call(x)},isObject:function(x){return"[object Object]"===Object.prototype.toString.call(x)},isValue:function(x){return!this.isObject(x)&&!this.isArray(x)}},overallThemes_dark={dark:"Default"},overallThemes_light={light:"Light"},editorThemes_dark={dracula:"Dracula",monokai:"Monokai",cobalt:"Cobalt"},editorThemes_light={textmate:"TextMate",overleaf:"Overleaf",eclipse:"Eclipse"};let up_notifications_comments=localStorage.getObject("notifications_comment")||!0,up_notifications_comment_threads=localStorage.getObject("notifications_comment_response")||!0,up_notifications_chats=localStorage.getObject("notifications_chat")||!0,up_notifications_tracked_changes_created=localStorage.getObject("notifications_tracked_changes_created")||!0,up_notifications_tracked_changes_updated=localStorage.getObject("notifications_tracked_changes_updated")||!0,up_notifications_tracked_changes_resolved=localStorage.getObject("notifications_tracked_changes_resolved")||!0,up_colormode_switching=localStorage.getObject("colormode_switching")||!0,up_overalltheme_dark=localStorage.getObject("overalltheme_dark")||overallThemes_dark[0],up_overalltheme_light=localStorage.getObject("overalltheme_light")||overallThemes_light[0],up_editortheme_dark=localStorage.getObject("editortheme_dark")||editorThemes_dark[0],up_editortheme_light=localStorage.getObject("editortheme_light")||editorThemes_light[0],up_wordcount_tracking=localStorage.getObject("wordcount_tracking")||!0,up_wordcount_dailytarget=localStorage.getObject("wordcount_dailytarget")||200,up_wordcount_notificationhour=localStorage.getObject("wordcount_notificationhour")||18,up_wordcount_dailytarget_min=1,up_wordcount_dailytarget_max=2147483647,up_wordcount_notificationhour_min=-1,up_wordcount_notificationhour_max=23,settings_form;function getFormSelectHTML(category_dicts,category_names){let str="";for(category_index in category_dicts){let endstr="";category_names.length-1>=category_index&&(str+=`<optgroup label="${category_names[category_index]}">`,endstr+="</optgroup>"),category_dict=category_dicts[category_index];for(let key in category_dict)str+=`<option value="${key}">${category_dict[key]}</option>\n`;str+=endstr}return str}function setupPreferencesPane(){const settings_html=`\n        <h4>Native Overleaf</h4>\n        <div class="containter-fluid">\n            <p style="margin: 0">Version ${appversion}</p> \n            <button id="versionlabel" style="margin-bottom: 5px">Check for updates</button>\n            <button onClick="window.open('https://github.com/fjwillemsen/NativeOverleaf');">View on GitHub</button>\n            <form id="native-overleaf-settings" class="settings">\n                <h6>Notifications</h6>\n                    <label class="settings-toggle">\n                        <input id="notifications_chat" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Chat messages</span>\n                    </label>\n                    <br/>\n                    <label class="settings-toggle">\n                        <input id="notifications_comment" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Comments</span>\n                    </label>\n                    <br/>\n                    <label class="settings-toggle">\n                        <input id="notifications_comment_response" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Comment threads</span>\n                    </label>\n                    <br/>\n                    <br/>\n                    <b>Suggested Changes</b><br/>\n                    <i>Get notifications on tracked changes</i>\n                    <br/>\n                    <label class="settings-toggle">\n                        <input id="notifications_tracked_changes_created" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Added suggestions</span>\n                    </label>\n                    <br/>\n                    <label class="settings-toggle">\n                        <input id="notifications_tracked_changes_updated" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Updated suggestions</span>\n                    </label>\n                    <br/>\n                    <label class="settings-toggle">\n                        <input id="notifications_tracked_changes_resolved" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Resolved suggestions</span>\n                    </label>\n                <hr/>\n                <h6>Dark / Light Mode</h6>\n                    <label class="settings-toggle">\n                        <input id="colormode_switching" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Follow system</span>\n                    </label>\n                    <br/>\n                    <br/>\n                    <b>Dark Mode</b>\n                    <br/>\n                        <label for="overalltheme_dark">Overall</label>\n                        <select id="overalltheme_dark">\n                            ${getFormSelectHTML([overallThemes_dark,overallThemes_light],["dark","light"])}\n                        </select>\n                        <br/>\n                        <label for="editortheme_dark">Editor</label>\n                        <select id="editortheme_dark">\n                            ${getFormSelectHTML([editorThemes_dark,editorThemes_light],["dark","light"])}\n                        </select>\n                    <br/>\n                    <br/>\n                    <b>Light Mode</b>\n                    <br/>\n                        <label for="overalltheme_light">Overall</label>\n                        <select id="overalltheme_light">\n                            ${getFormSelectHTML([overallThemes_light,overallThemes_dark],["light","dark"])}\n                        </select>\n                        <br/>\n                        <label for="editortheme_light">Editor</label>\n                        <select id="editortheme_light">\n                            ${getFormSelectHTML([editorThemes_light,editorThemes_dark],["light","dark"])}\n                        </select>\n                <hr/>\n                <h6>Wordcount Tracking</h6>\n                    <p>When the document is recompiled, this keeps track of the number of words, allowing you to see your progress.</p>\n                    <label class="settings-toggle">\n                        <input id="wordcount_tracking" class="settings-toggle-checkbox" type="checkbox">\n                        <div class="settings-toggle-switch"></div>\n                        <span class="settings-toggle-label">Tracking</span>\n                    </label>\n                    <br/>\n                        <label for="wordcount_dailytarget">Daily number of words target:<br/><i>(0 means no target)</i></label>\n                        <input type="number" id="wordcount_dailytarget" min="${up_wordcount_dailytarget_min}" max="${up_wordcount_dailytarget_max}">\n                    <br/>\n                        <label for="wordcount_notificationhour">Hour of daily notification:<br/><i>(0 to 23, -1 means no notification)</i></label>\n                        <input type="number" id="wordcount_notificationhour" min="${up_wordcount_notificationhour_min}" max="${up_wordcount_notificationhour_max}">\n                    <br/>\n                    <br/>\n                        <div class="btn btn-primary" id="button_show_wordcount_graph">Show wordcount graph</div>\n                    <br/>\n                    <br/>\n                        <div class="btn btn-warning" id="button_reset_wordcount">Reset wordcount</div>\n            </div>\n        </form>`;document.querySelector("#left-menu")&&(document.querySelector("#left-menu").getElementsByTagName("form")[0].insertAdjacentHTML("afterend",settings_html),settings_form=document.querySelector("#native-overleaf-settings"),settings_form.querySelector("#notifications_chat").checked=up_notifications_chats,settings_form.querySelector("#notifications_comment").checked=up_notifications_comments,settings_form.querySelector("#notifications_comment_response").checked=up_notifications_comment_threads,settings_form.querySelector("#notifications_tracked_changes_created").checked=up_notifications_tracked_changes_created,settings_form.querySelector("#notifications_tracked_changes_updated").checked=up_notifications_tracked_changes_updated,settings_form.querySelector("#notifications_tracked_changes_resolved").checked=up_notifications_tracked_changes_resolved,settings_form.querySelector("#colormode_switching").checked=up_colormode_switching,settings_form.querySelector("#overalltheme_dark").value=up_overalltheme_dark,settings_form.querySelector("#overalltheme_light").value=up_overalltheme_light,settings_form.querySelector("#editortheme_dark").value=up_editortheme_dark,settings_form.querySelector("#editortheme_light").value=up_editortheme_light,settings_form.querySelector("#wordcount_tracking").checked=up_wordcount_tracking,settings_form.querySelector("#wordcount_dailytarget").value=up_wordcount_dailytarget,settings_form.querySelector("#wordcount_notificationhour").value=up_wordcount_notificationhour,settings_form.querySelector("#overalltheme_dark").disabled=!up_colormode_switching,settings_form.querySelector("#overalltheme_light").disabled=!up_colormode_switching,settings_form.querySelector("#editortheme_dark").disabled=!up_colormode_switching,settings_form.querySelector("#editortheme_light").disabled=!up_colormode_switching,settings_form.querySelector("#wordcount_dailytarget").disabled=!up_wordcount_tracking,settings_form.querySelector("#wordcount_notificationhour").disabled=!up_wordcount_tracking,settings_form.addEventListener("change",(function(){for(let id_key in settings_handler)settings_handler[id_key](id_key,settings_form.querySelector(`#${id_key}`))})),document.getElementById("button_show_wordcount_graph").addEventListener("click",(()=>{showWordCountChart()})),document.getElementById("button_reset_wordcount").addEventListener("click",(()=>{let text_number_of_days="";void 0!==wordcounts&&void 0!==wordcounts[this.project_id]&&(text_number_of_days=`You currently have ${Object.keys(wordcounts[this.project_id]).length} tracked days.`);confirm(`Are you sure you want to remove all tracked wordcount history?\n                    ${text_number_of_days}`)&&(resetWordCounts(),setupWordCount())})))}const settings_handler={notifications_chat:set_notifications_chat,notifications_comment:set_notifications_comment,notifications_comment_response:set_notifications_comment_response,notifications_tracked_changes_created:set_notifications_tracked_changes_created,notifications_tracked_changes_updated:set_notifications_tracked_changes_updated,notifications_tracked_changes_resolved:set_notifications_tracked_changes_resolved,colormode_switching:set_colormode_switching,overalltheme_dark:set_overalltheme_dark,overalltheme_light:set_overalltheme_light,editortheme_dark:set_editortheme_dark,editortheme_light:set_editortheme_light,wordcount_tracking:set_wordcount_tracking,wordcount_dailytarget:set_wordcount_dailytarget,wordcount_notificationhour:set_wordcount_notificationhour};function set_notifications_tracked_changes_created(key,value){value.checked!=up_notifications_tracked_changes_created&&(up_notifications_tracked_changes_created=value.checked,localStorage.setObject(key,value.checked),1==up_notifications_tracked_changes_created&&1==notificationsRequiresSetup()?setupNotifications():1==notificationsRequiresDestruction()&&destructWordCount())}function set_notifications_tracked_changes_updated(key,value){value.checked!=up_notifications_tracked_changes_updated&&(up_notifications_tracked_changes_updated=value.checked,localStorage.setObject(key,value.checked),1==up_notifications_tracked_changes_updated&&1==notificationsRequiresSetup()?setupNotifications():1==notificationsRequiresDestruction()&&destructWordCount())}function set_notifications_tracked_changes_resolved(key,value){value.checked!=up_notifications_tracked_changes_resolved&&(up_notifications_tracked_changes_resolved=value.checked,localStorage.setObject(key,value.checked),1==up_notifications_tracked_changes_resolved&&1==notificationsRequiresSetup()?setupNotifications():1==notificationsRequiresDestruction()&&destructWordCount())}function set_wordcount_tracking(key,value){value.checked!=up_wordcount_tracking&&(up_wordcount_tracking=value.checked,localStorage.setObject(key,value.checked),settings_form.querySelector("#wordcount_dailytarget").disabled=!up_wordcount_tracking,settings_form.querySelector("#wordcount_notificationhour").disabled=!up_wordcount_tracking,1==up_wordcount_tracking?setupWordCount():destructWordCount())}function set_wordcount_dailytarget(key,value){value.value<up_wordcount_dailytarget_min||value.value>up_wordcount_dailytarget_max?(alert(`You set ${value.value}, but wordcount daily target must be between ${up_wordcount_dailytarget_min} and ${up_wordcount_dailytarget_max}`),settings_form.querySelector(`#${key}`).value=up_wordcount_dailytarget):value.value!=up_wordcount_dailytarget&&(up_wordcount_dailytarget=value.value,localStorage.setObject(key,value.value),setHasBeenNotified(!1))}function set_wordcount_notificationhour(key,value){(value.value<up_wordcount_notificationhour_min||value.value>up_wordcount_notificationhour_max)&&(alert(`You set ${value.value}, but wordcount notification hour must be between ${up_wordcount_notificationhour_min} and ${up_wordcount_notificationhour_max}`),settings_form.querySelector(`#${key}`).value=up_wordcount_notificationhour),value.value!=up_wordcount_notificationhour&&(up_wordcount_notificationhour=value.value,localStorage.setObject(key,value.value),setHasBeenNotified(!1))}function set_notifications_chat(key,value){value!=up_notifications_chats&&(up_notifications_chats=value.checked,localStorage.setObject(key,value.checked),destructNotifications(),setupNotifications())}function set_notifications_comment(key,value){value.checked!=up_notifications_comments&&(up_notifications_comments=value.checked,localStorage.setObject(key,value.checked),destructNotifications(),setupNotifications())}function set_notifications_comment_response(key,value){value.checked!=up_notifications_comment_threads&&(up_notifications_comment_threads=value.checked,localStorage.setObject(key,value.checked),destructNotifications(),setupNotifications())}function set_colormode_switching(key,value){value.checked!=up_colormode_switching&&(up_colormode_switching=value.checked,localStorage.setObject(key,value.checked),settings_form.querySelector("#overalltheme_dark").disabled=!up_colormode_switching,settings_form.querySelector("#overalltheme_light").disabled=!up_colormode_switching,settings_form.querySelector("#editortheme_dark").disabled=!up_colormode_switching,settings_form.querySelector("#editortheme_light").disabled=!up_colormode_switching,1==up_colormode_switching?setupColormode():destructColormode())}function themesetter(user_preference_variable_name,key,value){const user_preference_variable=eval(user_preference_variable_name);localStorage.setObject(key,value.value),value.value!=user_preference_variable&&(eval(`${user_preference_variable_name} = "${value.value}"`),switchColorMode())}function set_overalltheme_dark(key,value){themesetter("up_overalltheme_dark",key,value)}function set_overalltheme_light(key,value){themesetter("up_overalltheme_light",key,value)}function set_editortheme_dark(key,value){themesetter("up_editortheme_dark",key,value)}function set_editortheme_light(key,value){themesetter("up_editortheme_light",key,value)}const overallThemeToOverleaf={dark:"",light:"light-"};function switchColorMode(){let scope=angular.element("[ng-controller=SettingsController]").scope();scope&&("dark"==current_colorscheme_preference?(scope.settings.overallTheme=overallThemeToOverleaf[up_overalltheme_dark],scope.settings.editorTheme=up_editortheme_dark):"light"==current_colorscheme_preference?(scope.settings.overallTheme=overallThemeToOverleaf[up_overalltheme_light],scope.settings.editorTheme=up_editortheme_light):console.err(`current colorscheme preference ${current_colorscheme_preference} is not a valid value`),scope.$apply())}function autoChangeColorMode(event){current_colorscheme_preference=event.matches?"dark":"light",switchColorMode()}function setupColormode(){void 0!==colorscheme&&1==up_colormode_switching&&(switchColorMode(),colorscheme.addEventListener("change",autoChangeColorMode,!0))}function destructColormode(){void 0!==colorscheme&&0==up_colormode_switching&&colorscheme.removeEventListener("change",autoChangeColorMode,!0)}function sendNotification(text){new Notification(`${text}`),updateCounter(1)}function cleanAndTruncateText(text,max_characters=15){return(text=text.replace(/(\r\n|\n|\r)/gm,"")).length>max_characters&&(text=text.substring(0,max_characters)+"..."),text}function notificationsCooledDown(seconds=5,timestamp=lastNotificationResetTimestamp){return Date.now()-timestamp>1e3*seconds}async function setupNotifications(){if(1==(1==up_notifications_chats||1==up_notifications_comments||1==up_notifications_comment_threads||1==up_notifications_tracked_changes_created||1==up_notifications_tracked_changes_updated||1==up_notifications_tracked_changes_resolved)){if("Notification"in window?"granted"===Notification.permission||"denied"!==Notification.permission&&Notification.requestPermission((function(permission){"granted"===permission&&sendNotification("Notifications are now enabled")})):alert("This browser does not support notifications"),addEventListener("focus",resetCounter),1==up_notifications_tracked_changes_created||1==up_notifications_tracked_changes_updated||1==up_notifications_tracked_changes_resolved){let changes_scope=angular.element("[ng-controller=ReviewPanelController]").scope();if(changes_scope&&void 0!==changes_scope){if(void 0!==changes_watcher_unbind)throw"changes_watcher_unbind should be undefined at this point";changes_watcher_unbind=changes_scope.$watch("reviewPanel.entries",(function(newVal,oldVal){oldVal=oldVal[Object.keys(oldVal)[0]],newVal=newVal[Object.keys(newVal)[0]];const diffs=deepDiffMapper.map(oldVal,newVal),users=angular.element("[ng-controller=ReviewPanelController]").scope().reviewPanel.formattedProjectMembers;for(const diff_key in diffs){let payload=diffs[diff_key];if(null!=payload&&(payload.content&&void 0!==payload.content&&(payload=payload.content),payload.type&&void 0!==payload.type))if("created"==payload.type){let message=payload.updated;message.content=cleanAndTruncateText(message.content);const user=users[message.metadata.user_id];1==up_notifications_tracked_changes_created&&1!=user.isSelf&&new Date(message.metadata.ts)>new Date(lastNotificationResetTimestamp)&&notificationsCooledDown(1,lastChangeNotificationTimestamp)&&("aggregate-change"==message.type?sendNotification(`${user.name} suggests changing "${cleanAndTruncateText(message.metadata.replaced_content)}" to "${message.content}"`):"insert"==message.type?sendNotification(`${user.name} suggests adding "${message.content}"`):"delete"==message.type&&sendNotification(`${user.name} suggests removing "${message.content}"`),lastChangeNotificationTimestamp=Date.now())}else if("updated"==payload.type)1==up_notifications_tracked_changes_updated&&void 0!==payload.original&&"string"==typeof payload.original&&void 0!==payload.updated&&"string"==typeof payload.updated&&0==document.hasFocus()&&(notificationsCooledDown(60,lastChangeNotificationTimestamp)&&sendNotification(`Suggested change "${cleanAndTruncateText(payload.original)}" was updated to "${cleanAndTruncateText(payload.updated)}"`),lastChangeNotificationTimestamp=Date.now());else if("deleted"==payload.type){if(1==up_notifications_tracked_changes_resolved&&void 0!==payload.original&&notificationsCooledDown(1)&&0==document.hasFocus()){let message=payload.original;message.content=cleanAndTruncateText(message.content),"aggregate-change"==payload.original.type?sendNotification(`Resolved suggestion to change "${cleanAndTruncateText(message.metadata.replaced_content)}" to "${message.content}"`):"insert"==message.type?sendNotification(`Resolved suggestion to add "${message.content}"`):"delete"==message.type&&sendNotification(`Resolved suggestion to delete "${message.content}"`),lastChangeNotificationTimestamp=Date.now()}}else console.warn("Unrecognized payload type",payload)}}),!0)}}if(1==up_notifications_comments){let comments_scope=angular.element("[ng-controller=ReviewPanelController]").scope();if(comments_scope&&void 0!==comments_scope){if(void 0!==comments_watcher_unbind)throw"comments_watcher_unbind should be undefined at this point";comments_watcher_unbind=comments_scope.$watch("reviewPanel.commentThreads",(function(newVal,oldVal){const diffs=deepDiffMapper.map(oldVal,newVal);for(const diff_key in diffs){let payload=diffs[diff_key];if(payload.resolved&&payload.resolved_at&&payload.resolved_by_user){const user=payload.resolved_by_user.updated;new Date(payload.resolved_at.updated)>lastNotificationResetTimestamp&&!user.isSelf&&sendNotification(`${user.name} resolved a comment`)}let actionText="responded to a comment";payload.updated&&(payload=payload.updated,actionText="commented");const messages=payload.messages;for(const message_index in messages){let message=messages[message_index];message.updated&&(message=message.updated,!up_notifications_comment_threads)||message.timestamp>lastNotificationResetTimestamp&&message.user&&message.content&&!message.user.isSelf&&sendNotification(`${message.user.name} ${actionText}: ${message.content}`)}}}),!0)}}if(1==up_notifications_chats){let chat_scope=angular.element('[class="infinite-scroll messages"]').children().children();chat_scope&&chat_scope.length&&chat_scope[1]&&(void 0===chat_observer&&(chat_observer=new MutationObserver((function(mutations){if(mutations.length&&(mutations=mutations[mutations.length-1]),notificationsCooledDown(2))for(const message_index in mutations.addedNodes)message=mutations.addedNodes[message_index],message.getElementsByClassName&&(wrapper=message.getElementsByClassName("message-wrapper")[0],wrapper.getElementsByClassName("name").length&&(sendername=wrapper.getElementsByClassName("name")[0].getElementsByTagName("span")[0].innerHTML,contents=wrapper.getElementsByClassName("message")[0].getElementsByClassName("message-content"),last_texts=contents[contents.length-1].getElementsByTagName("p"),last_text=last_texts[last_texts.length-1].innerHTML,sendNotification(`${sendername} in chat: ${last_text}`)))}))),chat_observer.observe(chat_scope[1],{childList:!0,subtree:!0}))}}}function destructNotifications(){void 0!==comments_watcher_unbind&&(comments_watcher_unbind(),comments_watcher_unbind=void 0),void 0!==changes_watcher_unbind&&(changes_watcher_unbind(),changes_watcher_unbind=void 0),void 0!==chat_observer&&chat_observer.disconnect(),removeEventListener("focus",resetCounter)}function countEnabledNotificationPreferences(){return!!up_notifications_chats+!!up_notifications_comments+!!up_notifications_comment_threads+!!up_notifications_tracked_changes_created+!!up_notifications_tracked_changes_updated+!!up_notifications_tracked_changes_resolved}function notificationsRequiresSetup(){return 1==countEnabledNotificationPreferences()}function notificationsRequiresDestruction(){return 0==countEnabledNotificationPreferences()}function updateCounter(countToAdd){if(notificationCounter+=countToAdd,notificationCounter<=0)return resetCounter();const replaceOldCounter=/^(\(\d*\))\W/;replaceOldCounter.test(document.title)?document.title=document.title.replace(replaceOldCounter,`(${notificationCounter}) `):document.title=`(${notificationCounter}) ${originalDocumentTitle}`}function resetCounter(event){console.log("Reset notification counter"),notificationCounter=0,document.title=originalDocumentTitle,lastNotificationResetTimestamp=Date.now()}function addCSS(){let styleSheet=document.createElement("style");styleSheet.innerText='\n        .native-overleaf-settings {\n            display: inline-block;\n            width: 260px;\n        }\n\n        .settings-toggle {\n            cursor: pointer;\n            display: inline-block;\n        }\n        .settings-toggle-switch {\n            display: inline-block;\n            background: #2e3644;\n            border-radius: 16px;\n            width: 58px;\n            height: 32px;\n            position: relative;\n            vertical-align: middle;\n            transition: background 0.25s;\n        }\n        .settings-toggle-switch:before, .settings-toggle-switch:after {\n            content: "";\n        }\n        .settings-toggle-switch:before {\n            display: block;\n            background: linear-gradient(to bottom, #fff 0%, #eee 100%);\n            border-radius: 50%;\n            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);\n            width: 24px;\n            height: 24px;\n            position: absolute;\n            top: 4px;\n            left: 4px;\n            transition: left 0.25s;\n        }\n        .settings-toggle:hover .settings-toggle-switch:before {\n            background: linear-gradient(to bottom, #fff 0%, #fff 100%);\n            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);\n        }\n        .settings-toggle-checkbox:checked + .settings-toggle-switch {\n            background: #408827;\n        }\n        .settings-toggle-checkbox:checked + .settings-toggle-switch:before {\n            left: 30px;\n        }\n        .settings-toggle-checkbox {\n            position: absolute;\n            visibility: hidden;\n        }\n        .settings-toggle-label {\n            margin-left: 5px;\n            position: relative;\n            top: 2px;\n        }\n        dialog {\n            width: 80vw;\n            background: #EEEFEE;\n            color: black;\n            border-color: #E9E9E9;\n            margin: auto;\n            position: fixed;\n            box-shadow: 5px;\n        }\n        dialog::backdrop {\n            background: black;\n            opacity: 0.7;\n            backdrop-filter: blur(25px);\n        }\n        \n        @media (prefers-color-scheme: dark) {\n            dialog {\n                background: #282A35;\n                color: white;\n                border-color: #485263;\n            }\n            #wordcountchart {\n                filter: invert(1) hue-rotate(180deg);\n            }\n        }\n    ',document.head.appendChild(styleSheet)}async function fetchAsync(url){let response=await fetch(url);return await response.json()}function semanticVersionCompare(a,b){return a.startsWith(b+"-")?-1:b.startsWith(a+"-")?1:a.localeCompare(b,void 0,{numeric:!0,sensitivity:"case",caseFirst:"upper"})}async function checkForUpdate(reportAll=!1){const tags=await fetchAsync("https://api.github.com/repos/fjwillemsen/NativeOverleaf/tags");if(!tags.length||void 0===tags.length)return void console.error("Can not retrieve latest version for update checking");const latest_version=tags[0].name.replace("v",""),comparison=semanticVersionCompare(latest_version,appversion);if(0==comparison&&""!==comparison)console.log("Update check completed, no update available."),1==reportAll&&alert("You're up to date with the latest version!");else if(1==comparison){confirm(`Update available! \n            Current: ${appversion}, latest: ${latest_version}.\n            Go to downloads page?`)&&window.open("https://github.com/fjwillemsen/NativeOverleaf/releases/latest/")}else if(-1==comparison){const result_text=`No update needed, current version (${appversion}) is newer than latest publicly available version (${latest_version}).`;console.log(result_text),1==reportAll&&alert(result_text)}else{const result_text=`Invalid semantic version comparison outcome: ${comparison}`;console.log(result_text),1==reportAll&&alert(result_text)}}function setAutoUpdateChecking(){checkForUpdate(),setInterval(checkForUpdate,216e5),document.querySelector("#versionlabel")&&(document.querySelector("#versionlabel").onclick=function(){checkForUpdate(!0)})}let wordcount_timer_id,compilation_observer,wordcounts;async function waitUntilPDFCompiled(){return await recursiveCheckAndWait(isPDFLinkAvailable,500,5,!0)}function extractWordCount(){const modal=document.getElementById("clone-project-modal");if(modal&&void 0!==modal){const modaltext=modal.outerText,wordcount=modaltext.substring(modaltext.lastIndexOf("\nTotal Words:\n")+14,modaltext.lastIndexOf("\nHeaders:")),parsedWordCount=parseInt(wordcount);if(0==isNaN(parsedWordCount))return parsedWordCount}return!1}async function getWordCount(){let wordcount_el=angular.element("[ng-controller=WordCountModalController]");if(wordcount_el&&void 0!==wordcount_el&&void 0!==wordcount_el.scope){let wordcount_scope=wordcount_el.scope();if(void 0!==wordcount_scope&&0!=await waitUntilPDFCompiled()){wordcount_scope.openWordCountModal();const wordcount=await recursiveCheckAndWait(extractWordCount,50,100);return wordcount_scope.handleHide(),0==wordcount?void console.warn("Unable to get wordcount within 5 seconds, skipping"):wordcount}}}function getWordCounts(){let wordcounts=localStorage.getObject("wordcounts")||{};this.project_id in wordcounts||(wordcounts[this.project_id]={});const currentdate=getLocalDate();return currentdate in wordcounts[this.project_id]||(wordcounts[this.project_id][currentdate]={earliest:void 0,latest:void 0,hasbeennotified:!1}),wordcounts}function resetWordCounts(){return wordcounts=void 0,localStorage.removeItem("wordcounts")}async function updateWordCount(){wordcounts=getWordCounts();const currentdate=getLocalDate(),wordcount=await getWordCount(),hasbeennotified=wordcounts[this.project_id][currentdate].hasbeennotified;if(void 0===wordcount)return;void 0===wordcounts[this.project_id][currentdate].earliest&&(wordcounts[this.project_id][currentdate].earliest=wordcount),wordcounts[this.project_id][currentdate].latest=wordcount;const achieved_wordcount=wordcount-wordcounts[this.project_id][currentdate].earliest;if(0==hasbeennotified&&up_wordcount_dailytarget>0&&achieved_wordcount>=up_wordcount_dailytarget&&(new Notification("Awesome, already met today's target!",{body:`You wrote ${achieved_wordcount} words, ${achieved_wordcount-up_wordcount_dailytarget} above target!`}),wordcounts[this.project_id][currentdate].hasbeennotified=!0),0==hasbeennotified&&up_wordcount_notificationhour>-1){(new Date).getHours()==up_wordcount_notificationhour&&(up_wordcount_dailytarget<=0?new Notification(`You wrote ${achieved_wordcount} out of ${up_wordcount_dailytarget} words today.`):achieved_wordcount<up_wordcount_dailytarget?new Notification("You failed to meet today's target",{body:`You wrote ${achieved_wordcount} out of ${up_wordcount_dailytarget} words.`}):new Notification("Congrats, you met today's target!",{body:`You wrote ${achieved_wordcount} words, ${achieved_wordcount-up_wordcount_dailytarget} above target!`}),wordcounts[this.project_id][currentdate].hasbeennotified=!0)}localStorage.setObject("wordcounts",wordcounts),void 0!==wordcountchart&&updateWordCountChartData()}function setHasBeenNotified(value){const currentdate=getLocalDate();wordcounts[this.project_id][currentdate].hasbeennotified=value}async function setupWordCount(){if(1==up_wordcount_tracking){if(void 0===this.project_id)return void console.warn("Project ID is not defined, unable to keep word count");if(0!=await waitUntilPDFCompiled()){updateWordCount();let pdf_element=getBackupElement(1);void 0===compilation_observer&&(compilation_observer=new MutationObserver((function(mutations){console.log("PDF compiled, updating wordcount"),updateWordCount()}))),compilation_observer.observe(pdf_element,{attributes:!0})}}}function destructWordCount(){0==up_wordcount_tracking&&void 0!==compilation_observer&&compilation_observer.disconnect()}Object.defineProperty(document,"title",{set:function(newValue){""!=newValue&&"New Message"!=newValue&&(document.getElementsByTagName("title")[0].innerHTML=newValue)}}),"undefined"!=typeof exports&&(module.exports={fetchAsync:fetchAsync,semanticVersionCompare:semanticVersionCompare});const backup_types=["Source","PDF"];let up_backup=!0,up_backup_type=0,wordcountchart,wordcountchartdialog;function getBackupElement(backup_type_index){if(document.querySelector("#left-menu")){const backup_source_html=document.querySelector("#left-menu").getElementsByClassName("nav-downloads")[0].getElementsByTagName("li")[backup_type_index];if(void 0!==backup_source_html&&backup_source_html.getElementsByTagName("a").length>0)return backup_source_html.getElementsByTagName("a")[0]}return!1}function getBackupLink(backup_type_index){const backup_element=getBackupElement(backup_type_index);return""!=backup_element?backup_element.href:""}function isPDFLinkAvailable(){return getBackupElement(1)}function doBackup(){getBackupLink(up_backup_type)}let wordcountchart_show_net_wordcount=!0;async function getChartJS(){return $.ajaxSetup({cache:!0}),$.when($.getScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js")).done((()=>{lib_chartjs_loaded=!0})).fail((()=>{alert("Unable to dynamically load ChartJS, do you have an active internet connection?")}))}function injectWordCountChartElement(){document.querySelector("#chat-wrapper").insertAdjacentHTML("afterend",'<dialog id="wordcountchartdialog">\n            <p>Word count overview per day</p>\n            <label class="settings-toggle">\n                <input id="show_net_wordcount" class="settings-toggle-checkbox" type="checkbox">\n                <div class="settings-toggle-switch"></div>\n                <span class="settings-toggle-label">Net number of words written</span>\n            </label>\n            <div>\n                <canvas id="wordcountchart"></canvas>\n            </div>\n        </dialog>');const dialog=document.querySelector("#wordcountchartdialog");return dialog.addEventListener("click",(function(event){const rect=dialog.getBoundingClientRect();(event.clientY<rect.top||event.clientY>rect.bottom||event.clientX<rect.left||event.clientX>rect.right)&&dialog.close()})),document.getElementById("show_net_wordcount").checked=wordcountchart_show_net_wordcount,document.getElementById("show_net_wordcount").addEventListener("change",(()=>{wordcountchart_show_net_wordcount=document.getElementById("show_net_wordcount").checked,updateWordCountChartData()})),dialog}function getWordCountChartConfig(){let labels=[],counts=[];const label=1==wordcountchart_show_net_wordcount?"Net number of words written":"Total number of words";let config={type:"bar",data:{labels:labels,datasets:[]},options:{}};if(null==wordcounts||Object.keys(wordcounts).length<=0)return alert("Wordcounts have not been tracked or have not properly loaded, check that wordcount tracking is enabled and recompile the PDF"),config;const wordcounts_project=wordcounts[this.project_id];for(const[date,wordcount]of Object.entries(wordcounts_project)){labels.push(date);const count=1==wordcountchart_show_net_wordcount?wordcount.latest-wordcount.earliest:wordcount.latest;counts.push(count)}return 1==wordcountchart_show_net_wordcount&&up_wordcount_dailytarget>0&&config.data.datasets.push({label:"Daily target",data:Array(labels.length).fill(up_wordcount_dailytarget),type:"line",backgroundColor:"red",borderColor:"red"}),config.data.datasets.push({label:label,data:counts,backgroundColor:"#408827"}),config}function updateWordCountChartData(){const config=getWordCountChartConfig();wordcountchart.data.labels=config.data.labels,wordcountchart.data.datasets=config.data.datasets,wordcountchart.update()}async function showWordCountChart(){await getChartJS(),null==wordcountchartdialog&&(wordcountchartdialog=injectWordCountChartElement(),wordcountchart=new Chart(document.getElementById("wordcountchart"),getWordCountChartConfig())),wordcountchartdialog.showModal()}function hideWordCountChart(){wordcountchartdialog.close()}const startTime=performance.now();setupColormode(),setupNotifications(),setupPreferencesPane(),addCSS(),setAutoUpdateChecking(),setupWordCount();const endTime=performance.now();console.log(`Native Overleaf injected setup took ${endTime-startTime} milliseconds`);