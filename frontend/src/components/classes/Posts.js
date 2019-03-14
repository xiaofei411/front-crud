import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Edit from './Edit';
import Delete from './Delete';


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  }
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    margin: 16,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  cellwidth1: {
    width:600,
  },
  cellwidth2: {
    width:350
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class CustomizedTable extends React.Component {

  state = {
    open: false,
  }

  render() {
    const { classes, rows } = this.props;

  
    return (
      <Fragment>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell className={classes.cellwidth2}>Title</CustomTableCell>
                <CustomTableCell className={classes.cellwidth1}>Description</CustomTableCell>
                <CustomTableCell className={classes.cellwidth2}>Action</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow className={classes.row} key={row.id}>
                  <CustomTableCell component="th" scope="row" className={classes.cellwidth2}>
                    {row.name}
                  </CustomTableCell>
                  <CustomTableCell className={classes.cellwidth1}>{row.description}</CustomTableCell>
                  <CustomTableCell className={classes.cellwidth2}>
                    <Edit row={row} onEdit={this.props._onEdit}/>
                    <Delete row={row} onDelete={this.props._onDelete}/>
                  </CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Fragment>
    );
  }
  
}

CustomizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTable);