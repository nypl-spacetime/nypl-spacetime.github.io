---
layout:
---
var s3Url = '{{site.s3-url}}'

var statusFilename = 'etl-results.json'

function formatNumber (number) {
  return number
    .toString()
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    .join(',')
    .split('')
    .reverse()
    .join('')
}

var template
d3.text('js/dataset-details.html', function (text) {
  template = doT.template(text)
})

function datasetDetailsPeriodMouseOver (element) {
  var dataset = element.getAttribute('data-dataset')
  var value = element.getAttribute('data-value')
  var year = element.getAttribute('data-year')
  var htmlFor = element.getAttribute('data-for')

  var hoverBox = d3.select('#dataset-details-period-hover-box-' + dataset)

  hoverBox.select('.dataset-details-period-hover-box-year')
    .html(year + ' - ' + (parseInt(year) + 9))

  hoverBox.select('.dataset-details-period-hover-box-value')
    .html(formatNumber(value) + (value === 1 ? ' object' : ' objects'))

  var bar = d3.select('#' + htmlFor).node()
  var rect = bar.getBoundingClientRect()

  var top = rect.top - 75
  var left = rect.left + rect.width / 2

  hoverBox
    .style('display', 'block')
    .style('top', top + 'px')
    .style('left', left + 'px')
}

function datasetDetailsPeriodMouseOut (element) {
  var dataset = element.getAttribute('data-dataset')

  d3.select('#dataset-details-period-hover-box-' + dataset)
    .style('display', 'none')
}

d3.selectAll('#datasets .dataset-details-off .dataset-view-details')
  .on('click', function () {
    if (!template) {
      return
    }

    var id = this.dataset.datasetDetailsId
    var dataset = this.dataset.datasetName

    var statusUrl = s3Url + dataset + '/' + statusFilename
    d3.json(statusUrl, function (statusJson) {
      d3.selectAll('#datasets .dataset-details-off')
        .style('display', 'table-row')

      d3.selectAll('#datasets .dataset-details-on')
        .style('display', 'none')

      d3.select('#' + id + '-off')
        .style('display', 'none')

      var templateData = {
        s3Url: s3Url,
        id: statusJson.dataset.id,
        dataset: {},
        stats: {}
      }

      var datasetKeys = {
        title: 'Title',
        author: 'Author',
        // editor: 'Editor',
        website: 'Website'
      }

      var datasetTransform = {
        website: function (value) {
          return '<a href="' + value + '">' + value + '</a>'
        }
        // author: TODO: Bert Spaan <bertspaan@nypl.org>
      }

      var templateDatasetJson = {}
      Object.keys(datasetKeys).forEach(function (key) {
        if (statusJson.dataset[key]) {
          var value = statusJson.dataset[key]
          templateData.dataset[datasetKeys[key]] = datasetTransform[key] ? datasetTransform[key](value) : value
        }
      })

      if (statusJson.stats && statusJson.stats.objects) {
        templateData.stats.objects = {}
        templateData.stats.objects.count = formatNumber(statusJson.stats.objects.count)

        var types = []

        Object.keys(statusJson.stats.objects.types).forEach(function (type) {
          var count = statusJson.stats.objects.types[type]
          types.push({
            type: type,
            count: count
          })
        })

        templateData.stats.objects.types = types
          .sort(function (a, b) {
            return b.count - a.count
          }).slice(0, 3).map(function (type) {
            return type.type
          })

        if (statusJson.stats.objects.decades) {
          var decades = statusJson.stats.objects.decades

          var newDecades = []
          var total = statusJson.stats.objects.count

          var yearStart = 1710
          var yearEnd = 1960
          var yearStep = 10

          var maxCount = 0
          Object.keys(decades).forEach(function (decade) {
            if (decades[decade] > maxCount) {
              maxCount = decades[decade]
            }
          })

          for (var year = yearStart; year <= yearEnd; year += yearStep) {
            if (decades[year]) {
              var percentage = Math.round(decades[year] / maxCount * 100)
              newDecades.push({
                year: year,
                value: decades[year],
                percentage: percentage
              })
            } else {
              newDecades.push({
                year: year,
                value: 0,
                percentage: 0
              })
            }
          }


          templateData.stats.objects.decades = newDecades
          templateData.stats.objects.decadesDesc = newDecades
            .filter(function (decade) {
              return decade.value > 0
            })
            .map(function (decade) {
              return decade.year + ': ' + decade.value +
                (decade.value === 1 ? ' object' : ' objects')
            })
            .join('; ')
        }
      }

      var html = template(templateData)

      d3.select('#' + id + '-content')
        .html(html)

      d3.select('#' + id + '-last-updated')
        .html(moment(statusJson.date).fromNow())

      d3.select('#' + id + '-on')
        .style('display', 'table-row')
    })
  })
