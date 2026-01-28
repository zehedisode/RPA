import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Button, Checkbox, Form, Input, Modal } from 'antd'
import { getStorageManager } from '@/services/storage'
import AnthropicService, { NO_ANTHROPIC_API_KEY_ERROR } from '@/services/ai/anthropic/anthropic.service'
import { Actions as simpleActions } from '@/actions/simple_actions'
import * as actions from '@/actions'
import { State } from '@/reducers/state'
import { message } from 'antd'

interface AiTabProps {
  config: { [key: string]: any }
  updateConfig: (config: { [key: string]: any }) => void
}

interface AiTabAppState {
  anthropicAPIKey: string
  prompt: string
  promptResponse: string
  error: string
}

class AITab extends React.Component<AiTabProps, AiTabAppState> {
  constructor(props: any) {
    super(props)
    this.onClickTestPrompt = this.onClickTestPrompt.bind(this)
  }

  state: AiTabAppState = {
    anthropicAPIKey: '',
    prompt: 'Explain a random Ui.Vision command',
    promptResponse: '',
    error: ''
  }

  async onClickTestPrompt() {
    console.log('anthropicAPIKey:>> ', this.props.config.anthropicAPIKey)

    const anthropicAPIKey = this.props.config.anthropicAPIKey || ''
    if (!anthropicAPIKey) {
      message.error(NO_ANTHROPIC_API_KEY_ERROR)
      return
    }

    const anthropicService = new AnthropicService(this.props.config.anthropicAPIKey)

    anthropicService
      ?.getPromptResponse(this.state.prompt)
      .then((response) => {
        this.setState({ promptResponse: response })
        this.setState({ error: '' })
      })
      .catch((error) => {
        console.error('Error getting response:', error)
        // this.setState({ error: error.message })
        message.error(error.message)
      })
  }

  render() {
    const onConfigChange = (key: string, val: any) => {
      this.props.updateConfig({ [key]: val })
    }

    return (
      <div className="ai-tab">
        <div className="row" style={{ marginBottom: '20px' }}>
          Yapay zeka komutları özelliği şu anda deneysel/beta aşamasındadır. Anthropic API'sini kullanır. Yapay zeka komutlarını etkinleştirmek için lütfen aşağıya
          (ücretsiz) Anthropic API anahtarınızı girin{' '}
          <a href="https://goto.ui.vision/x/idehelp?help=ai" target="_blank">
            {' '}
            (daha fazla bilgi)
          </a>
          :
        </div>

        <div className="ai-settings-item">
          <span className="label-text">API Anahtarı:</span>
          <Input
            type="text"
            value={this.state.anthropicAPIKey}
            onChange={(e) => {
              this.setState({ anthropicAPIKey: e.target.value })
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              if (this.props.config.anthropicAPIKey) {
                Modal.confirm({
                  title: 'Onayla',
                  content: 'Mevcut API anahtarının üzerine yazmak istiyor musunuz?',
                  okText: 'Evet',
                  cancelText: 'Hayır',
                  onOk: () => {
                    onConfigChange('anthropicAPIKey', this.state.anthropicAPIKey)
                    this.setState({ anthropicAPIKey: '' })
                  }
                })
              } else {
                onConfigChange('anthropicAPIKey', this.state.anthropicAPIKey)
                this.setState({ anthropicAPIKey: '' })
              }
            }}
          // disabled={this.state.anthropicAPIKey == this.props.config.anthropicAPIKey}
          >
            Kaydet
          </Button>
        </div>
        <div className="ai-settings-item">
          <span className="label-text">İstem (Prompt):</span>
          <Input
            type="text"
            value={this.state.prompt || 'Merhaba Claude'} //is this text used anywhere?
            onChange={(e) => {
              this.setState({ prompt: e.target.value })
            }}
          />
          <Button type="primary" onClick={this.onClickTestPrompt}>
            Test Et
          </Button>
        </div>
        <div className="row" style={{ marginBottom: '10px' }}>
          Anthropic API (Claude) Yanıtı:
        </div>
        <div className="ai-response">
          <pre>{this.state.promptResponse}</pre>
        </div>
        <div className="ai-settings-item">
          <span className="label-text">
            <strong>aiComputerUse:</strong> Durmadan önceki maksimum döngü:{' '}
          </span>
          <Input
            type="number"
            min="0"
            style={{ marginLeft: '10px', width: '70px' }}
            value={this.props.config.aiComputerUseMaxLoops}
            onChange={(e) => onConfigChange('aiComputerUseMaxLoops', e.target.value)}
            placeholder=""
          />
        </div>

        <div className="ai-chat-in-sidebar">
          <Checkbox
            onClick={(e) => {
              onConfigChange('useInitialPromptInAiChat', (e.target as HTMLInputElement).checked)
            }}
            checked={this.props.config.useInitialPromptInAiChat}
          >
            Yan panelde AI Sohbeti. Başlangıç istemini kullan.
          </Checkbox>
          <Input
            type="text"
            value={this.props.config.aiChatSidebarPrompt || 'Gördüğünü 10 kelime veya daha azıyla açıkla.'}
            onChange={(e) => {
              onConfigChange('aiChatSidebarPrompt', e.target.value)
            }}
          />
        </div>

        <div className="row" style={{ marginBottom: '10px', color: 'red' }}>
          {this.state.error}
        </div>
      </div>
    )
  }
}

export default connect(
  (state: State) => ({
    status: state.status,
    config: state.config
  }),
  (dispatch: Dispatch) => bindActionCreators({ ...actions, ...simpleActions }, dispatch)
)(AITab)
