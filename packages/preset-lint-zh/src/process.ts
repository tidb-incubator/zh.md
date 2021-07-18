import {VFile} from "vfile";
import {IgnoreScope, IIgnore} from "./ignore";
import * as vfileMessage from "vfile-message";


export const processIgnore = (file: VFile, ignores: IIgnore[]) => {
  ignores.forEach(config => {
    if (config.scope === IgnoreScope.FILE) {
      let newMessage: vfileMessage.VFileMessage[] = [];
      file.messages.forEach(message => {
        if (message.ruleId === config.ruleId) {
          return
        }
        newMessage.push(message)
      })
      file.messages = newMessage;
    }
    if (config.scope === IgnoreScope.LINE) {
      let newMessage: vfileMessage.VFileMessage[] = [];
      file.messages.forEach(message => {
        if (message.line===config.line && message.ruleId === config.ruleId) {
          return
        }
        newMessage.push(message)
      })
      file.messages = newMessage;
    }
  })
  return file;
}