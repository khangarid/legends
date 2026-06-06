/**
 * Google Apps Script — paste into your sheet:
 * Extensions → Apps Script → paste this file → Save
 *
 * Setup:
 * 1. Create a GitHub fine-grained PAT with "Actions: Read and write" on khangarid/legends
 *    (or a classic PAT with `repo` scope)
 * 2. In Apps Script: Project Settings → Script properties → add GITHUB_TOKEN
 * 3. Run installSheetChangeTrigger once (select it in the dropdown, click Run, authorize)
 *
 * When the sheet changes, this triggers a GitHub Actions rebuild.
 */

const GITHUB_OWNER = 'khangarid'
const GITHUB_REPO = 'legends'
const DISPATCH_EVENT = 'sheet-updated'
const DEBOUNCE_MINUTES = 2

function installSheetChangeTrigger() {
  const triggers = ScriptApp.getProjectTriggers()
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'onSheetChange') {
      ScriptApp.deleteTrigger(trigger)
    }
  }

  ScriptApp.newTrigger('onSheetChange')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onChange()
    .create()
}

function onSheetChange() {
  const cache = CacheService.getScriptCache()
  if (cache.get('deployTriggered')) return

  triggerGitHubDeploy()
  cache.put('deployTriggered', '1', DEBOUNCE_MINUTES * 60)
}

function triggerGitHubDeploy() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN')
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN in Script properties')
  }

  const response = UrlFetchApp.fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`,
    {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      payload: JSON.stringify({ event_type: DISPATCH_EVENT }),
      muteHttpExceptions: true,
    },
  )

  if (response.getResponseCode() !== 204) {
    throw new Error(`GitHub dispatch failed (${response.getResponseCode()}): ${response.getContentText()}`)
  }
}
