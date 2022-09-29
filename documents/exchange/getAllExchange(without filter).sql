SELECT
    bem.exch_abbrev,
    bem.book_num,
    bem.exch_full_name,
    bem.exch_abbrev_2,
    bem.section_num,
    bem.create_user_id,
    bem.last_updt_user_id,
    bem.create_ts,
    bem.last_updt_ts,
    bnem.npa_exch_id    AS bnem_npa_exch_id,
    bnem.npa            AS bnem_npa,
    bnem.exch_abbrev    AS bnem_exch_abbrev
FROM
    blif_exch_mtnc      bem
    LEFT OUTER JOIN blif_npa_exch_mtnc  bnem ON ( bem.exch_abbrev = bnem.exch_abbrev )