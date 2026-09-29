import { AppBar, Box, Breadcrumbs, Button, Checkbox, Chip, CircularProgress, Divider, FormControlLabel, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material'
import type { ConceptFixture, WorkspaceFrame } from './fixtures'
import { denseConcepts, normalDensityConcepts, paymentConcepts, selectedConcept, selectedRelations } from './fixtures'
import './knowledge-workspace.css'

export interface KnowledgeWorkspaceProps { frame: WorkspaceFrame }
const frameCopy: Record<WorkspaceFrame, { status: string }> = {
  WF01: { status: 'Ограниченный обзор' }, WF02: { status: 'Найдено концептов: 3' },
  WF03: { status: 'Переход к Payment Intent' }, WF04: { status: 'Выбрано · фокус не изменён' },
  WF05: { status: '5 концептов · 4 связи' },
  WF07: { status: 'Настройка видимости связей' }, WF08: { status: 'Фильтр применён · структурированные результаты обновлены' },
  WF11: { status: '48 концептов · обычная плотность' }, WF13: { status: '144 концепта · высокая плотность' },
}
function SearchPanel({ frame }: KnowledgeWorkspaceProps) {
  const filterOpen = frame === 'WF07'
  const filterApplied = frame === 'WF08'
  return <Stack component="section" aria-labelledby="explore-heading" spacing={2} className="workspace-panel explore-panel">
    <Typography id="explore-heading" component="h2" variant="h6">Обзор</Typography>
    <TextField label="Поиск концептов" size="small" value={frame === 'WF01' ? '' : 'payment'} placeholder="Поиск в Payment Processing" slotProps={{ input: { readOnly: true } }} />
    {frame === 'WF02' && <Paper component="section" variant="outlined" aria-label="Результаты поиска"><List dense disablePadding>{paymentConcepts.slice(0, 3).map((concept) => <ListItem key={concept.id} disablePadding><ListItemButton selected={concept.id === selectedConcept.id}><ListItemText primary={concept.title} secondary={`${concept.kind} · ${concept.area}`} /></ListItemButton></ListItem>)}</List></Paper>}
    <Box><Typography variant="overline">Область</Typography><Typography>Payment Processing</Typography><Typography variant="caption" color="text.secondary">Ограниченный fixture · 12 концептов</Typography></Box>
    <Divider /><Box><Typography variant="overline">Фильтры связей</Typography><Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}><Chip size="small" label={filterApplied ? 'Активно: 2 из 4' : 'Активно: 4'} /><Chip size="small" label={filterApplied ? 'Фильтр применён' : 'Показаны все'} variant="outlined" /></Stack></Box>
    {filterOpen && <Paper component="section" variant="outlined" className="control-panel" aria-label="Фильтры типов связей"><Typography component="h3" variant="subtitle2">Видимость связей</Typography>{['prerequisite', 'contains', 'protected_by', 'precedes'].map((relation) => <FormControlLabel key={relation} control={<Checkbox size="small" defaultChecked />} label={relation} />)}<Button size="small" variant="contained">Применить</Button></Paper>}
    <Divider /><Box><Typography variant="overline">История фокуса</Typography><Typography variant="body2">{frame === 'WF01' || frame === 'WF02' ? 'Обзор' : 'Обзор → Payment Intent'}</Typography></Box>
  </Stack>
}
function ConceptCard({ concept, state }: { concept: ConceptFixture; state?: 'selected' | 'focused' }) {
  const stateLabel = state === 'selected' ? 'выбрано' : state === 'focused' ? 'в фокусе' : undefined
  return <Paper variant="outlined" className={`concept-card ${state ? `concept-card--${state}` : ''}`} aria-label={`${concept.title}${stateLabel ? `, ${stateLabel}` : ''}`}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'start', gap: 2 }}><Box><Typography component="h3" variant="subtitle1">{concept.title}</Typography><Typography variant="caption" color="text.secondary">{concept.kind} · {concept.area}</Typography></Box>{stateLabel && <Chip size="small" color="primary" variant={state === 'focused' ? 'filled' : 'outlined'} label={stateLabel} />}</Stack>
    <Typography variant="body2">{concept.description}</Typography>
  </Paper>
}
function DensitySurface({ dense }: { dense?: boolean }) {
  const concepts = dense ? denseConcepts : normalDensityConcepts
  return <TableContainer component={Paper} variant="outlined" tabIndex={0} className={dense ? 'concept-table concept-table--dense' : 'concept-table'} aria-label={dense ? 'Плотный структурированный список: 144 концепта' : 'Структурированный список: 48 концептов'}>
    <Table stickyHeader size="small"><TableHead><TableRow><TableCell>Reference</TableCell><TableCell>Concept</TableCell><TableCell>Kind</TableCell><TableCell>Area</TableCell></TableRow></TableHead><TableBody>{concepts.map((concept) => <TableRow key={concept.id}><TableCell>{concept.reference}</TableCell><TableCell><strong>{concept.title}</strong></TableCell><TableCell>{concept.kind}</TableCell><TableCell>{concept.area}</TableCell></TableRow>)}</TableBody></Table>
  </TableContainer>
}

function Representation({ frame }: KnowledgeWorkspaceProps) {
  const selected = frame === 'WF03' || frame === 'WF04'
  const focused = ['WF05', 'WF07', 'WF08'].includes(frame)
  const density = frame === 'WF11' || frame === 'WF13'
  return <Stack component="main" aria-labelledby="representation-heading" spacing={2} className="representation-panel">
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography id="representation-heading" component="h2" variant="h5">Payment Processing</Typography><Typography variant="body2" color="text.secondary">Структурированное представление · базовый R0</Typography></Box><Stack direction="row" sx={{ gap: 1 }}><Chip label="Семантический режим" size="small" variant="outlined" />{frame === 'WF08' && <Chip label="Фильтр: 2 типа" size="small" />}</Stack></Stack>
    {frame === 'WF03' && <Paper variant="outlined" className="focus-transition" role="status" aria-live="polite"><CircularProgress size={22} aria-label="Выполняется переход к фокусу" /><Box><Typography component="p" variant="subtitle2">Переход к Payment Intent</Typography><Typography variant="caption">Предыдущий фокус сохранён: Обзор</Typography></Box></Paper>}
    {focused && <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2"><strong>Локальный контекст:</strong> Payment Intent · 1 шаг</Typography><Chip size="small" label="Показано 5 из 12 · ограничено" /></Stack>}
    {density ? <DensitySurface dense={frame === 'WF13'} /> : <Box className="concept-grid">{(focused ? paymentConcepts.slice(0, 5) : paymentConcepts).map((concept) => <ConceptCard key={concept.id} concept={concept} state={concept.id === selectedConcept.id ? (focused ? 'focused' : selected ? 'selected' : undefined) : undefined} />)}</Box>}
    {focused && <Typography variant="caption" color="text.secondary">Контекст ограничен одним шагом. Расширение доступно в панели деталей.</Typography>}
    {frame === 'WF11' && <Typography variant="caption" color="text.secondary">48 строк · структурированный список · provisional fixture</Typography>}
    {frame === 'WF13' && <Typography variant="caption" color="text.secondary">144 строки · плотная таблица · поиск и детали доступны</Typography>}
  </Stack>
}
function DetailPanel({ frame }: KnowledgeWorkspaceProps) {
  const hasSelection = ['WF03', 'WF04', 'WF05', 'WF07', 'WF08'].includes(frame)
  if (!hasSelection) return <Stack component="aside" aria-labelledby="detail-heading" spacing={2} className="workspace-panel detail-panel"><Typography id="detail-heading" component="h2" variant="h6">Детали</Typography><Typography color="text.secondary">Выберите концепт, чтобы изучить его смысл и типизированные связи.</Typography></Stack>
  return <Stack component="aside" aria-labelledby="detail-heading" spacing={2} className="workspace-panel detail-panel"><Box><Typography id="detail-heading" component="h2" variant="h6">{selectedConcept.title}</Typography><Typography variant="body2" color="text.secondary">{selectedConcept.kind} · {selectedConcept.area}</Typography></Box><Typography variant="body2">{selectedConcept.description}</Typography><Divider />
    <Box><Typography variant="overline">Исходящие связи</Typography>{selectedRelations.outgoing.map((relation) => <Typography key={`${relation.type}-${relation.target}`} variant="body2">Payment Intent → <strong>{relation.type}</strong> → {relation.target}</Typography>)}</Box>
    <Box><Typography variant="overline">Входящие связи</Typography>{selectedRelations.incoming.map((relation) => <Typography key={`${relation.type}-${relation.target}`} variant="body2">{relation.target} ← <strong>{relation.type}</strong> ← Payment Intent</Typography>)}</Box>
    <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}><Button variant="contained" size="small">Фокус</Button><Button variant="outlined" size="small">Расширить</Button><Button variant="text" size="small">Изолировать</Button></Stack></Stack>
}
export function KnowledgeWorkspace({ frame }: KnowledgeWorkspaceProps) {
  const copy = frameCopy[frame]
  return <Box className="knowledge-workspace"><AppBar position="static" color="transparent" elevation={0} className="workspace-topbar"><Toolbar variant="dense"><Typography variant="h6" component="h1">Prep</Typography><Breadcrumbs aria-label="Область знаний"><Typography>Knowledge</Typography><Typography>Payment Processing</Typography></Breadcrumbs><Typography variant="body2" color="text.secondary">R0 · Структурированный обзор</Typography></Toolbar></AppBar>
    <Box className="workspace-body"><SearchPanel frame={frame} /><Representation frame={frame} /><DetailPanel frame={frame} /></Box>
    <Paper square elevation={0} component="footer" className="task-strip"><Box><Typography variant="overline">Задача 1 · Проследить платёжный поток</Typography><Typography variant="body2">{copy.status}</Typography></Box><Stack direction="row" sx={{ gap: 1 }}><Button size="small" disabled={frame === 'WF01'}>Назад</Button><Button size="small" variant="outlined">Ответить</Button></Stack></Paper></Box>
}
