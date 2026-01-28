import { faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as C from '@/common/constant'
import storage from '@/common/storage'
import { getState } from '@/ext/common/global_state'
import * as actions from '../../actions'
import { delayMs } from '../../common/utils'
import getSaveTestCase from '../../components/save_test_case'
import DashboardBottom from './bottom'
import './dashboard.scss'
import DashboardEditor from './editor'
import Ext from '../../common/web_extension'

class Dashboard extends React.Component {
  state = {
    tabIdToPlay: undefined,
    isOpenInSidePanelBtnActive: true,
    bottomPanelHeight: -1,
    permissionRequired: false
  }

  handleStorageChange = ([changedObj]) => {
    // TODO: remove this block of code. Maybe it's not needed as this state property is updated in componentDidMount
    // if (changedObj.key === 'background_state') {
    //   this.setState({ tabIdToPlay: changedObj.newValue.tabIds.toPlay });
    // }

    if (changedObj.key === 'config') {
      let getAllChangedProperties = Object.keys(changedObj.newValue).filter(key => changedObj.newValue[key] !== changedObj.oldValue[key])
      if (getAllChangedProperties.includes('disableOpenSidepanelBtnTemporarily')) {
        if (changedObj.newValue.disableOpenSidepanelBtnTemporarily) {
          this.setState({ isOpenInSidePanelBtnActive: false })
        } else {
          getState().then(state => {
            this.setState({ tabIdToPlay: state.tabIds.toPlay })
            if (Ext.isFirefox()) {
              return chrome.sidebarAction.open()
            } else {
              chrome.sidePanel.setOptions({
                enabled: true
              }).then(() => {
                this.setState({ isOpenInSidePanelBtnActive: true })
              })
            }
          })
        }
      }
    }
  }

  componentDidMount() {
    // firefox requires explicit permission to access all urls
    // otherwise user will need to allow access for each url manually  
    if (Ext.isFirefox()) {
      Ext.permissions.contains({ origins: ['<all_urls>'] }).then(permissionGranted => {
        if (!permissionGranted) {
          this.setState({ permissionRequired: true })
        }
      })
    }

    // set open sidepanel button active after 4 seconds anyway
    delayMs(4000).then(() => {
      this.props.updateConfig({
        disableOpenSidepanelBtnTemporarily: false
      })
      this.setState({ isOpenInSidePanelBtnActive: true })
    })

    getState().then(state => {
      this.setState({ tabIdToPlay: state.tabIds.toPlay })
    })
      .then(() => {
        if (!Ext.isFirefox()) {
          chrome.sidePanel.setOptions({
            enabled: true
          })
        }
      })


    storage.get('config').then(config => {
      if (Object.keys(config).includes('disableOpenSidepanelBtnTemporarily')) {
        this.setState({ isOpenInSidePanelBtnActive: !config.disableOpenSidepanelBtnTemporarily })
      } else {
        this.setState({ isOpenInSidePanelBtnActive: true })
      }
    })

    storage.addListener(this.handleStorageChange)
  }


  onBottomPanelHeightChange = (height) => {
    this.setState({ bottomPanelHeight: height })
  }

  onGrantPermission = () => {
    Ext.permissions.request({ origins: ['<all_urls>'] }).then((result) => {
      console.log('permission result:>>', result)
      if (result) {
        this.setState({ permissionRequired: false })
      } else {
        // visit https://goto.ui.vision/x/idehelp?help=firefox_access_data_permission in new tab 
        Ext.tabs.create({
          url: 'https://goto.ui.vision/x/idehelp?help=firefox_access_data_permission',
          active: true
        })
      }
    })
  }

  render() {
    const isWindows = /windows/i.test(window.navigator.userAgent)

    return (
      <div className="dashboard">
        <DashboardEditor bottomPanelHeight={this.state.bottomPanelHeight} />
        <DashboardBottom onBottomPanelHeightChange={this.onBottomPanelHeightChange} />

        <div className="online-help">
          <Button className="btn-open-in-sidepanel"
            disabled={this.state.isOpenInSidePanelBtnActive && this.props.player.status === C.PLAYER_STATUS.STOPPED ? false : true}
            onClick={async () => {
              console.log('this.state.tabIdToPlay:>>', this.state.tabIdToPlay)

              if (Ext.isFirefox()) {
                const userResponse = confirm('Yan paneli açmak için Tamam\'a tıklayın ve ardından araç çubuğundaki uzantı simgesine tıklayın.')
                if (!userResponse) return

                await this.props.updateConfig({ ["oneTimeShowSidePanel"]: true })

                getSaveTestCase().save().then(() => {
                  window.close()
                }).catch((err) => {
                  console.log('getSaveTestCase err:>>', err)
                })

                return
              } else {
                // Determine target tabId
                let targetTabId = this.state.tabIdToPlay;

                if (!targetTabId) {
                  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                  if (tabs && tabs[0]) {
                    targetTabId = tabs[0].id;
                  }
                }

                const openSidePanel = async (id) => {
                  if (id) {
                    return chrome.sidePanel.open({ tabId: id });
                  } else {
                    return chrome.sidePanel.open({}); // Global side panel
                  }
                };

                openSidePanel(targetTabId)
                  .then(() => {
                    getSaveTestCase().save().then(() => {
                      window.close()
                    }).catch((err) => {
                      console.log('getSaveTestCase err:>>', err)
                    })
                  })
                  .catch((err) => {
                    console.log('#25: open first attempt failed', err);
                    // Fallback to global side panel
                    openSidePanel()
                      .then(() => {
                        getSaveTestCase().save().then(() => {
                          window.close()
                        }).catch((err) => {
                          console.log('getSaveTestCase err:>>', err)
                        })
                      })
                      .catch((err2) => {
                        console.log('#25: open second attempt failed', err2);
                        message.error('Yan panel açılamadı. Lütfen eklentiyi kapatıp açmayı deneyin.');
                      });
                  });
              }
            }}
          >
            <FontAwesomeIcon icon={faTableColumns} />
            <span>Yan Panelde Aç</span>
          </Button>
          {
            this.state.permissionRequired &&
            <Button
              className="btn-request-permission"
              onClick={() => {
                this.onGrantPermission()
              }}
            >
              <span>Sekme İzni Gerekli</span>
            </Button>
          }
          <div style={{ visibility: isWindows ? 'visible' : 'hidden' }}>
            <a href="https://goto.ui.vision/x/idehelp?help=visual" target="_blank"></a>
          </div>
          <div>
            Ui.Vision Topluluğu:&nbsp;
            <a href="https://goto.ui.vision/x/idehelp?help=forum" target="_blank">Forumlar</a>&nbsp;|&nbsp;
            <a href="https://goto.ui.vision/x/idehelp?help=docs" target="_blank">Dokümantasyon</a>&nbsp;|&nbsp;
            <a href="https://goto.ui.vision/x/idehelp?help=github" target="_blank">Açık Kaynak</a>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    player: state.player,
  }),
  dispatch => bindActionCreators({ ...actions }, dispatch)
)(Dashboard)
