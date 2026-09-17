import React, { useEffect, useState } from "react";

import {
  Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, IconButton, InputAdornment, Table as MuiTable,
  TableBody, TableCell, TableHead, TableRow, Tooltip, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchRounded";
import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  VisibilityRounded as ViewIcon,
} from "@mui/icons-material";
import Page from "../../../components/Page";
import Report from "../../../components/reports/Report";
import Select from "../../../components/Select";
import TextField from "../../../components/TextField";

import useFetch from "../../../hooks/useFetch";
import { useToast } from "../../../hooks";
import {
  formatDateForDb,
  getDateRangeTitle,
  getFullName,
  numberFormat,
  throttle,
  getTodayDate,
} from "../../../helpers";

const DailyCashCollection = ({ module }) => {
  const addToast = useToast();
  const { data: paymentChannels } = useFetch(
    "api/payment-channels",
    {
      status: "Active",
      per_page: 500,
    },
    true,
    [],
    (response) => response.data.data.data
  );

  const [params, setParams] = useState({
    patient_id: undefined,
    patient_name: undefined,
    patient_gender: undefined,
    patient_phone: undefined,
    payment_channel_id: undefined,
    start_date: getTodayDate(),
    refreshKey: 0,
  });

  const [viewRecord, setViewRecord] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editType, setEditType] = useState("cash");
  const [editItems, setEditItems] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = `Daily Cash Collection Report - ${window.APP_NAME}`;
  }, []);

  const getType = (item) =>
    item.transaction_type === "Cash" ? "cash" : "installment";

  const getPatientFromRecord = (record) => {
    const p = record.items?.[0]?.payment_cache?.check_in?.patient;
    return p ? getFullName(p.first_name, p.middle_name, p.last_name) : "Unknown";
  };

  const handleView = async (item) => {
    setViewRecord(null);
    setViewOpen(true);
    try {
      const res = await window.axios.get(
        `/api/reports/payment-center/cash-collection/${getType(item)}/${item.source_id}`
      );
      setViewRecord(res.data.data);
    } catch (e) {
      addToast({ message: e.response?.data?.message || "Error loading details", severity: "error" });
      setViewOpen(false);
    }
  };

  const handleEdit = async (item) => {
    setEditRecord(null);
    setEditItems([]);
    setEditOpen(true);
    try {
      const res = await window.axios.get(
        `/api/reports/payment-center/cash-collection/${getType(item)}/${item.source_id}`
      );
      const record = res.data.data;
      const type = getType(item);
      setEditType(type);
      setEditRecord({ ...record, source_id: item.source_id });
      setEditItems(
        (record.items || []).map((it) => ({
          id: it.id,
          item: it.item?.name || "Unknown",
          unit_price: parseFloat(it.unit_price) || 0,
          quantity: parseInt(it.quantity) || 0,
        }))
      );
    } catch (e) {
      addToast({ message: e.response?.data?.message || "Error loading details", severity: "error" });
      setEditOpen(false);
    }
  };

  const handleQuantityChange = (index, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setEditItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, quantity: qty } : it))
    );
  };

  const getEditedTotal = () =>
    editItems.reduce((acc, it) => acc + (it.unit_price * it.quantity), 0);

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      await window.axios.put(
        `/api/reports/payment-center/cash-collection/${editType}/${editRecord.source_id}`,
        {
          items: editItems.map((it) => ({ id: it.id, quantity: it.quantity })),
        }
      );
      addToast({ message: "Updated successfully", severity: "success" });
      setEditOpen(false);
      setParams((p) => ({ ...p, refreshKey: (p.refreshKey || 0) + 1 }));
    } catch (e) {
      addToast({ message: e.response?.data?.message || "Error updating", severity: "error" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await window.axios.delete(
        `/api/reports/payment-center/cash-collection/${getType(deleteRecord)}/${deleteRecord.source_id}`
      );
      addToast({ message: "Deleted successfully", severity: "success" });
      setDeleteRecord(null);
      setParams((p) => ({ ...p, refreshKey: (p.refreshKey || 0) + 1 }));
    } catch (e) {
      addToast({ message: e.response?.data?.message || "Error deleting", severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const renderRecordItems = (record) => {
    if (!record) return null;
    const rows = record.items || [];
    return (
      <Box sx={{ overflowX: "auto", mt: 2 }}>
        <MuiTable size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{row.item?.name || "Unknown"}</TableCell>
                <TableCell align="right">{numberFormat(row.unit_price)}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">
                  {numberFormat((parseFloat(row.unit_price) || 0) * (parseInt(row.quantity) || 0))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </Box>
    );
  };

  return (
    <Page
      breadcrumbs={[
        { title: "Home" },
        { title: module || "Payment Center" },
        { title: "Reports" },
        { title: "Daily Cash Collection Report" },
      ]}
    >
      <Report
        title="Daily Cash Collection Report"
        subtitle={getDateRangeTitle(params.start_date, params.end_date)}
        uri="api/reports/payment-center/cash-collection"
        params={{
          ...params,
          start_date: params.start_date
            ? formatDateForDb(params.start_date)
            : undefined,
          end_date: params.end_date
            ? formatDateForDb(params.end_date)
            : undefined,
        }}
        prependInner={
          <React.Fragment>
            <Card variant="outlined" sx={{ bgcolor: "background.default", mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Patient Name"
                      placeholder="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(value) =>
                        throttle(
                          () => setParams({ ...params, patient_name: value }),
                          1000
                        )
                      }
                    />
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Patient Number"
                      placeholder="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(value) =>
                        throttle(
                          () => setParams({ ...params, patient_id: value }),
                          1000
                        )
                      }
                    />
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Select
                      label="Gender"
                      fullWidth
                      options={["Male", "Female"]}
                      clearable
                      onChange={(value) =>
                        setParams({ ...params, patient_gender: value })
                      }
                    />
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Select
                      label="Payment Channel"
                      fullWidth
                      options={paymentChannels}
                      optionsLabel="name"
                      optionsValue="id"
                      clearable
                      onChange={(value) =>
                        setParams({ ...params, payment_channel_id: value })
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </React.Fragment>
        }
        columns={[
          {
            field: "patient_name",
            headerName: "Patient Name",
            valueGetter: (item, index) =>
              getFullName(item.first_name, item.middle_name, item.last_name),
          },
          {
            field: "patient_id",
            headerName: "Patient Number",
            valueGetter: (item, index) => item.patient_id,
          },
          {
            field: "items",
            headerName: "Items",
          },
          {
            field: "amount",
            headerName: "Amount",
            valueGetter: (item, index) => numberFormat(item.amount),
          },
          {
            field: "discount",
            headerName: "Discount",
            valueGetter: (item, index) => numberFormat(item.discount),
          },
          {
            field: "subtotal",
            headerName: "Subtotal",
            valueGetter: (item, index) =>
              numberFormat(item.amount - item.discount),
          },
          {
            field: "channel",
            headerName: "Payment Channel",
            valueGetter: (item, index) => item.channel?.name,
          },
          {
            field: "created_by",
            headerName: "Created By",
            valueGetter: (item) => item.creator?.full_name,
          },
          {
            field: "created_at",
            headerName: "Date Created",
          },
          {
            field: "transaction_type",
            headerName: "Transaction Type",
          },
          {
            field: "actions",
            headerName: "Actions",
            webOnly: true,
            tableCellProps: { align: "center" },
            renderCell: (item) => (
              <Box display="flex" justifyContent="center">
                <Tooltip title="View">
                  <IconButton size="small" onClick={() => handleView(item)}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => handleEdit(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => setDeleteRecord(item)}>
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          },
        ]}
        summationFooterColumns={[
          { value: "TOTAL", span: 4, index: 1 },
          { reducer: (acc, item, index) => acc + (parseFloat(item.amount) || 0), index: 4 },
          { reducer: (acc, item, index) => acc + (parseFloat(item.discount) || 0), index: 5 },
          {
            reducer: (acc, item, index) => acc + ((parseFloat(item.amount) || 0) - (parseFloat(item.discount) || 0)),
            index: 6,
          },
        ]}
      />

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cash Collection Details</DialogTitle>
        <DialogContent>
          {!viewRecord ? (
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Patient</Typography>
                  <Typography variant="body2">{getPatientFromRecord(viewRecord)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Channel</Typography>
                  <Typography variant="body2">{viewRecord.channel?.name || viewRecord.channel_id || "-"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Amount</Typography>
                  <Typography variant="body2">{numberFormat(viewRecord.amount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Discount</Typography>
                  <Typography variant="body2">{numberFormat(viewRecord.discount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Subtotal</Typography>
                  <Typography variant="body2">
                    {numberFormat((parseFloat(viewRecord.amount) || 0) - (parseFloat(viewRecord.discount) || 0))}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Date</Typography>
                  <Typography variant="body2">{viewRecord.created_at}</Typography>
                </Grid>
              </Grid>
              {renderRecordItems(viewRecord)}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Cash Collection</DialogTitle>
        <DialogContent>
          {!editRecord || editItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Adjust item quantities. Total will be recalculated automatically.
              </Typography>
              <MuiTable size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="center" sx={{ width: 120 }}>Qty</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {editItems.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.item}</TableCell>
                      <TableCell align="right">{numberFormat(row.unit_price)}</TableCell>
                      <TableCell align="center" sx={{ width: 120 }}>
                        <TextField
                          fullWidth
                          type="number"
                          inputProps={{ min: 0 }}
                          size="small"
                          value={row.quantity}
                          onChange={(value) => handleQuantityChange(i, value)}
                        />
                      </TableCell>
                      <TableCell align="right">{numberFormat(row.unit_price * row.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight="bold">Discount</Typography>
                  <Typography variant="body2">{numberFormat(editRecord.discount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" fontWeight="bold" align="right">Total: {numberFormat(getEditedTotal())}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={savingEdit || !editRecord}>
            {savingEdit ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteRecord)} onClose={() => setDeleteRecord(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Record</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Delete this record? This will remove it from the daily cash collection and reset its items back to Pending.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRecord(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default DailyCashCollection;