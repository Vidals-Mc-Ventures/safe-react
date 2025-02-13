import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import {
  addressIsNotCurrentSafe,
  composeValidators,
  minMaxLength,
  required,
  uniqueAddress,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { safeOwnersAddressesListSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'

import { styles } from './style'
import { getExplorerInfo } from 'src/config'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core'

export const REPLACE_OWNER_NAME_INPUT_TEST_ID = 'replace-owner-name-input'
export const REPLACE_OWNER_ADDRESS_INPUT_TEST_ID = 'replace-owner-address-testid'
export const REPLACE_OWNER_NEXT_BTN_TEST_ID = 'replace-owner-next-btn'

import { OwnerValues } from '../..'

const formMutators = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'ownerAddress', () => args[0])
  },
}

const useStyles = makeStyles(styles)

type NewOwnerProps = {
  ownerAddress: string
  ownerName: string
}

type OwnerFormProps = {
  onClose: () => void
  onSubmit: (values: NewOwnerProps) => void
  ownerAddress: string
  ownerName: string
  initialValues?: OwnerValues
}

export const OwnerForm = ({
  onClose,
  onSubmit,
  ownerAddress,
  ownerName,
  initialValues,
}: OwnerFormProps): ReactElement => {
  const classes = useStyles()

  const handleSubmit = (values: NewOwnerProps) => {
    onSubmit(values)
  }
  const owners = useSelector(safeOwnersAddressesListSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const ownerDoesntExist = uniqueAddress(owners)
  const ownerAddressIsNotSafeAddress = addressIsNotCurrentSafe(safeAddress)

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Replace owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        formMutators={formMutators}
        onSubmit={handleSubmit}
        initialValues={{
          ownerName: initialValues?.newOwnerName,
          ownerAddress: initialValues?.newOwnerAddress,
        }}
      >
        {(...args) => {
          const mutators = args[3]

          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setOwnerAddress(scannedAddress)
            closeQrModal()
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <Row>
                  <Paragraph>
                    Review the trustee you want to replace from the active Trust. Then specify the new trustee you want to
                    replace it with:
                  </Paragraph>
                </Row>
                <Row>
                  <Paragraph>Current trustee</Paragraph>
                </Row>
                <Row className={classes.owner}>
                  <Col align="center" xs={12}>
                    <EthHashInfo
                      hash={ownerAddress}
                      name={ownerName}
                      showCopyBtn
                      showAvatar
                      explorerUrl={getExplorerInfo(ownerAddress)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Paragraph>New owner</Paragraph>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <Field
                      component={TextField}
                      name="ownerName"
                      placeholder="Trustee name*"
                      testId={REPLACE_OWNER_NAME_INPUT_TEST_ID}
                      text="Trustee name*"
                      type="text"
                      validate={composeValidators(required, minMaxLength(1, 50))}
                    />
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={8}>
                    <AddressInput
                      fieldMutator={mutators.setOwnerAddress}
                      name="ownerAddress"
                      placeholder="Trustee address*"
                      testId={REPLACE_OWNER_ADDRESS_INPUT_TEST_ID}
                      text="Trustee address*"
                      validators={[ownerDoesntExist, ownerAddressIsNotSafeAddress]}
                    />
                  </Col>
                  <Col center="xs" className={classes} middle="xs" xs={1}>
                    <ScanQRWrapper handleScan={handleScan} />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  minWidth={140}
                  testId={REPLACE_OWNER_NEXT_BTN_TEST_ID}
                  type="submit"
                  variant="contained"
                >
                  Next
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}