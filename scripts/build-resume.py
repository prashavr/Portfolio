"""Render the public resume from confirmed portfolio data. Requires reportlab."""
import json
import os
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
PROFILE = json.loads((ROOT / 'content/portfolio.json').read_text())
OUTPUT = ROOT / 'assets/Prashav-Rimal-Resume.pdf'
INK = colors.HexColor('#172337')
BODY = colors.HexColor('#343d4c')
LINE = colors.HexColor('#c5ccd6')
FONT_DIR = Path(os.environ.get('RESUME_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
pdfmetrics.registerFont(TTFont('Resume', str(FONT_DIR / 'DejaVuSerif.ttf')))
pdfmetrics.registerFont(TTFont('Resume-Bold', str(FONT_DIR / 'DejaVuSerif-Bold.ttf')))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='Resume-Bold', italic='Resume', boldItalic='Resume-Bold')

base = ParagraphStyle('body', fontName='Resume', fontSize=10, leading=14, textColor=BODY)
heading = ParagraphStyle('heading', parent=base, fontName='Resume-Bold', textColor=INK, spaceAfter=3)
label = ParagraphStyle('label', parent=heading, fontSize=11, leading=14)
name = ParagraphStyle('name', parent=heading, alignment=TA_CENTER, fontSize=21, leading=25, spaceAfter=4)
role = ParagraphStyle('role', parent=base, alignment=TA_CENTER, fontSize=11, leading=15, spaceAfter=7)
contact = ParagraphStyle('contact', parent=base, alignment=TA_CENTER, fontSize=9.5, leading=13)
small = ParagraphStyle('small', parent=base, fontSize=9.5, leading=13)

def p(text, style=base):
    return Paragraph(text, style)

def safe(text):
    return escape(str(text))

def entry(title, description, suffix=None):
    items = [p(safe(title), heading), p(safe(description))]
    if suffix:
        items.append(p(safe(suffix), small))
    return items

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=26, leftMargin=26,
    topMargin=21, bottomMargin=24, title='Prashav Rimal - Software Developer',
    author='Prashav Rimal', subject='Software development resume')
story = [p(safe(PROFILE['name']), name),
    p(safe(PROFILE['role'] + ' | ' + PROFILE['specialization']), role),
    p('Kumaltar, Lalitpur, Nepal &nbsp; | &nbsp; +9779866499550 &nbsp; | &nbsp; '
      '<link href="mailto:prashavrimal3@gmail.com">prashavrimal3@gmail.com</link>', contact),
    p('<link href="https://github.com/prashavr">github.com/prashavr</link> &nbsp; | &nbsp; '
      '<link href="https://prashavrimal.com.np">prashavrimal.com.np</link>', contact),
    Spacer(1, 13)]

def section(title, contents):
    table = Table([[p(title, label), contents]], colWidths=[91, A4[0] - 143])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (0, -1), 12),
        ('RIGHTPADDING', (1, 0), (1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LINEABOVE', (0, 0), (-1, 0), .55, LINE)
    ]))
    story.append(table)

section('Summary', [p(safe(PROFILE['summary']))])
education = []
for index, item in enumerate(PROFILE['education']):
    if index: education.append(Spacer(1, 8))
    title = f"<b>{safe(item['institution'])}</b> &nbsp; | &nbsp; {safe(item['period']).replace('–', '-')}"
    education.append(p(title))
    qualification = item['qualification'].replace('’', "'").replace('—', '-')
    if item['status']: qualification += ' - ' + item['status']
    education.append(p(safe(qualification)))
section('Education', education)

training = []
for item in PROFILE['training']:
    training.extend([p(safe(item['provider']), heading), p(safe(item['name']) + ' | 3 months | Completed')])
section('Training', training)

projects = []
for index, item in enumerate(PROFILE['projects']):
    if index: projects.append(Spacer(1, 8))
    description = item['type'] + ' | ' + item['context']
    if item['technologies']: description += ' | ' + ', '.join(item['technologies'])
    projects.extend(entry(item['name'], description))
section('Projects', projects)

skills = []
for index, group in enumerate(PROFILE['skills']):
    if index: skills.append(Spacer(1, 6))
    skills.extend([p(safe(group['name']), heading), p(safe(', '.join(group['items'])))])
section('Skills', skills)
section('Interests', [p(safe('; '.join(PROFILE['interests'])), small)])

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc.build(story)
print(OUTPUT)
