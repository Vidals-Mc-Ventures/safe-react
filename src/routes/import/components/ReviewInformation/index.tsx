import TableContainer from '@material-ui/core/TableContainer'
import React from 'react'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Grid from '@material-ui/core/Grid'
import { mainStyles } from 'src/theme/PageStyles'
import Row from 'src/components/layout/Row'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { FIELD_IMPORT_ADDRESS, FIELD_LOAD_NAME, THRESHOLD } from 'src/routes/import/components/fields'
import { getNumOwnersFrom, getOwnerAddressBy, getOwnerNameBy } from 'src/routes/create/components/fields'
import { getAccountsFrom } from 'src/routes/create/utils/safeDataExtractor'
import { useStyles } from './styles'
import { getExplorerInfo } from 'src/config'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { LoadFormValues } from 'src/routes/import/container'

const checkIfUserAddressIsAnOwner = (values: LoadFormValues, userAddress: string): boolean => {
  let isOwner = false

  for (let i = 0; i < getNumOwnersFrom(values); i += 1) {
    if (values[getOwnerAddressBy(i)] === userAddress) {
      isOwner = true
      break
    }
  }

  return isOwner
}

interface Props {
  userAddress: string
  values: LoadFormValues
}

const ReviewComponent = ({ userAddress, values }: Props): React.ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()
  const isOwner = checkIfUserAddressIsAnOwner(values, userAddress)
  const owners = getAccountsFrom(values)
  const safeAddress = values[FIELD_IMPORT_ADDRESS]

  return (
    <>
      <Block margin="lg">
        <Grid container direction="column">
          <Grid item sm={12} className={mainClasses.createStepOutActive}>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
              <Grid item className={mainClasses.createStepTitle}>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item className={mainClasses.createStepNum}>
                    <span>4</span>
                  </Grid>
                  <Grid item>Step 4: Review & Access</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Block>
      <Row className={classes.root}>
        <Col className={classes.detailsColumn} layout="column" xs={4}>
          <Block className={classes.details}>
            <Block margin="lg">
              <Paragraph color="primary" noMargin size="lg" data-testid="load-safe-step-three">
                Review details
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Name of the Trust
              </Paragraph>
              <Paragraph
                className={classes.name}
                color="primary"
                noMargin
                size="lg"
                weight="bolder"
                data-testid="load-form-review-safe-name"
              >
                {values[FIELD_LOAD_NAME]}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Trust address
              </Paragraph>
              <Row className={classes.container}>
                <EthHashInfo
                  hash={safeAddress}
                  shortenHash={4}
                  showAvatar
                  showCopyBtn
                  explorerUrl={getExplorerInfo(safeAddress)}
                />
              </Row>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Connected wallet client is trustee?
              </Paragraph>
              <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                {isOwner ? 'Yes' : 'No (read-only)'}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Any transaction requires the confirmation of:
              </Paragraph>
              <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                {`${values[THRESHOLD]} out of ${getNumOwnersFrom(values)} trustees`}
              </Paragraph>
            </Block>
          </Block>
        </Col>
        <Col className={classes.ownersColumn} layout="column" xs={8}>
          <TableContainer>
            <Block className={classes.owners}>
              <Paragraph color="primary" noMargin size="lg">
                {`${getNumOwnersFrom(values)} Trust trustees`}
              </Paragraph>
            </Block>
            {owners.map((address, index) => (
              <div key={index}>
                <Row className={classes.owner}>
                  <Col align="center" xs={12}>
                    <EthHashInfo
                      hash={address}
                      name={values[getOwnerNameBy(index)]}
                      showAvatar
                      showCopyBtn
                      explorerUrl={getExplorerInfo(address)}
                    />
                  </Col>
                </Row>
                {index !== owners.length - 1 && <Hairline />}
              </div>
            ))}
          </TableContainer>
        </Col>
      </Row>
    </>
  )
}

const Review = ({ userAddress }: { userAddress: string }) =>
  function ReviewPage(controls: React.ReactNode, { values }: { values: LoadFormValues }): React.ReactElement {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <ReviewComponent userAddress={userAddress} values={values} />
          {controls}
        </OpenPaper>
      </>
    )
  }

export default Review
